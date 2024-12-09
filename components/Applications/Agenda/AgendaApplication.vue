<script setup lang="ts">
import { marked } from 'marked'
import CodeEditor from '~/components/Applications/Lessons/CodeEditor.vue'
import Calendar from '~/components/Applications/Agenda/Calendar.vue'
import BackToApplications from '~/components/Applications/BackToApplications.vue'

const runtimeConfig = useRuntimeConfig()
const authorizationHeaders = useAuthorizationHeaders()
const { status, data, error, refresh } = useLazyFetch<{ [key: string]: any }>(`${runtimeConfig.public.apiUrl}/calendar/dates`, {
  headers: authorizationHeaders.value,
  server: false
})

const currentDate = ref<string | null>(null)
const modalShow = ref<boolean>(false)
const modalLoading = ref<boolean>(false)
const modalMarkdownContent = ref<string | null>(null)
const modalEdit = ref<boolean>(false)
const modalBackdrop = ref<HTMLElement | null>(null)
const editor = ref<InstanceType<typeof CodeEditor> | null>(null)

const modalTitle = computed<string | undefined>(() => currentDate.value === null ? undefined : new Date(currentDate.value).toLocaleString('default', { day: 'numeric', month: 'numeric', year: 'numeric' }))
const modalHtmlContent = computed(() => modalMarkdownContent.value == null ? null : marked.parse(modalMarkdownContent.value))

const onDayClicked = async (date: string) => {
  currentDate.value = date
  modalLoading.value = true
  modalShow.value = true
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
</script>

<template>
  <div>
    <div v-if="!error">
      <controls>
        <controls-section>
          <back-to-applications />
        </controls-section>
      </controls>
      <h1>Agenda</h1>
    </div>
    <b-modal
      id="date-modal"
      v-model="modalShow"
      :title="modalTitle"
      :close-button="undefined"
      :show-footer="!modalLoading"
      size="lg"
      @show="onModalShown"
      @hidden="onModalHidden"
      @close="modalEdit = false"
    >
      <div
        v-if="modalLoading"
        class="text-center"
      >
        <spinner />
      </div>
      <code-editor
        v-else-if="modalEdit"
        ref="editor"
        class="code-editor"
        :source-document="modalMarkdownContent === null ? '' : modalMarkdownContent"
        mode="markdown"
      />
      <div
        v-else
        @dblclick="modalEdit = true"
      >
        <div
          v-if="modalHtmlContent"
          v-html="modalHtmlContent"
        />
        <em v-else>Aucun contenu ici.</em>
      </div>
      <template #footer="{ close }">
        <b-button
          v-if="modalEdit && !modalLoading"
          variant="success"
          @click="saveContent"
        >
          Enregistrer
        </b-button>
        <b-button
          v-if="!modalLoading"
          variant="secondary"
          data-bs-dismiss="modal"
          @click="close"
        >
          Fermer
        </b-button>
      </template>
    </b-modal>
    <div
      id="modal-backdrop"
      ref="modalBackdrop"
    />
    <div v-if="status === 'pending'">
      <spinner />
    </div>
    <error-display
      v-else-if="error"
      :error="error"
    />
    <calendar
      v-else-if="data"
      ref="calendar"
      :dates="data.dates"
      @dayclick="onDayClicked"
    />
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
