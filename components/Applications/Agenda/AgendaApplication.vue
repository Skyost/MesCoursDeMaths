<script setup lang="ts">
import { marked } from 'marked'
import { ComponentPublicInstance } from 'vue'
import CodeEditor from '~/components/Applications/Lessons/CodeEditor.vue'
import Calendar from '~/components/Applications/Agenda/Calendar.vue'

const runtimeConfig = useRuntimeConfig()
const authorizationHeaders = useAuthorizationHeaders()
const { pending, data, error, refresh } = useLazyFetch<{ [key: string]: any }>(`${runtimeConfig.public.apiUrl}/calendar/dates`, {
  headers: authorizationHeaders.value,
  server: false
})

const currentDate = ref<string | null>(null)
const modalLoading = ref<boolean>(false)
const modalMarkdownContent = ref<string | null>(null)
const modalEdit = ref<boolean>(false)
const dateModal = ref<ComponentPublicInstance | null>(null)
const modalBackdrop = ref<HTMLElement | null>(null)
const editor = ref<InstanceType<typeof CodeEditor> | null>(null)

const modalTitle = computed(() => currentDate.value === null ? null : new Date(currentDate.value).toLocaleString('default', { day: 'numeric', month: 'numeric', year: 'numeric' }))
const modalHtmlContent = computed(() => modalMarkdownContent.value == null ? null : marked.parse(modalMarkdownContent.value))

const onDayClicked = async (date: string) => {
  const bootstrap = await import('bootstrap')
  currentDate.value = date
  const modal = new bootstrap.Modal(dateModal.value!.$el)
  modalLoading.value = true
  modal.show()
  if (data.value && 'dates' in data.value && data.value.dates.includes(date)) {
    const response = await $fetch<{ [key: string]: string }>(`${runtimeConfig.public.apiUrl}/calendar/get`, {
      params: { date },
      headers: authorizationHeaders.value
    })
    modalMarkdownContent.value = response.content
  }
  modalLoading.value = false
}

const saveContent = async () => {
  modalLoading.value = true
  modalMarkdownContent.value = editor.value!.document
  await $fetch(`${runtimeConfig.public.apiUrl}/calendar/update`, {
    method: 'POST',
    body: {
      date: currentDate.value,
      content: modalMarkdownContent.value
    },
    headers: authorizationHeaders.value
  })
  await refresh()
  modalEdit.value = false
  modalLoading.value = false
}

const onModalShown = async () => {
  document.querySelector<HTMLElement>('.page-header')!.style.setProperty('z-index', '1')
  modalBackdrop.value!.classList.add('d-block')
  await new Promise(resolve => setTimeout(resolve, 1))
  modalBackdrop.value!.classList.add('visible')
}

const onModalHidden = async () => {
  modalBackdrop.value!.classList.remove('visible')
  await new Promise(resolve => setTimeout(resolve, 150))
  document.querySelector<HTMLElement>('.page-header')!.style.removeProperty('z-index')
  modalBackdrop.value!.classList.remove('d-block')
}

onMounted(async () => {
  await nextTick()
  dateModal.value?.$el.addEventListener('show.bs.modal', onModalShown)
  dateModal.value?.$el.addEventListener('hide.bs.modal', onModalHidden)
})

onUnmounted(() => {
  dateModal.value?.$el.removeEventListener('show.bs.modal', onModalShown)
  dateModal.value?.$el.removeEventListener('hide.bs.modal', onModalHidden)
})
</script>

<template>
  <div>
    <h1 v-if="!error">Agenda</h1>
    <ski-modal
      id="date-modal"
      ref="dateModal"
      :title="modalTitle"
      :close-button="null"
      :show-footer="!modalLoading"
      size="lg"
      data-bs-backdrop="false"
      data-bs-keyboard="false"
    >
      <div v-if="modalLoading" class="text-center">
        <spinner />
      </div>
      <code-editor
        v-else-if="modalEdit"
        ref="editor"
        class="code-editor"
        :source-document="modalMarkdownContent === null ? '' : modalMarkdownContent"
        mode="markdown"
      />
      <div v-else @dblclick="modalEdit = true">
        <div v-if="modalHtmlContent" v-html="modalHtmlContent" />
        <em v-else>Aucun contenu ici.</em>
      </div>
      <template #buttons>
        <ski-button
          v-if="modalEdit && !modalLoading"
          variant="success"
          @click="saveContent"
        >
          Enregistrer
        </ski-button>
        <ski-button
          v-if="!modalLoading"
          variant="secondary"
          data-bs-dismiss="modal"
          @click="modalEdit = false"
        >
          Fermer
        </ski-button>
      </template>
    </ski-modal>
    <div id="modal-backdrop" ref="modalBackdrop" />
    <div v-if="pending">
      <spinner />
    </div>
    <error-display v-else-if="error" :error="error" />
    <calendar v-else-if="data" ref="calendar" :dates="data.dates" @dayclick="onDayClicked" />
  </div>
</template>

<style lang="scss" scoped>
.code-editor {
  min-height: 200px;
}

#modal-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background-color: black;
  transition: opacity 150ms;
  opacity: 0;

  &.visible {
    opacity: 0.5;
  }
}
</style>
