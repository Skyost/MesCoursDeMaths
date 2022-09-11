<script setup>
import { useLazyFetch, useRuntimeConfig } from '#app'
// eslint-disable-next-line import/order
import accessTokenUtils from '~/utils/access-token'

const runtimeConfig = useRuntimeConfig()
const { pending, data, error } = useLazyFetch(`${runtimeConfig.public.apiUrl}/calendar/dates`, {
  headers: accessTokenUtils.getAuthorizationHeaders()
  // server: false
})
</script>

<template>
  <protected>
    <page-head title="Agenda" />
    <teacher-navigation-entry />
    <page-navigation-entry title="Agenda" to="/prof/agenda/" />
    <h1 v-if="!error">Agenda</h1>
    <ski-modal
      id="date-modal"
      ref="dateModal"
      :title="currentDate === null ? null : currentDate.toLocaleString('default', { day: 'numeric', month: 'numeric', year: 'numeric' })"
      :close-button="null"
      size="lg"
      data-bs-backdrop="false"
      data-bs-keyboard="false"
    >
      <div v-if="modalLoading" class="text-center">
        <spinner />
      </div>
      <code-editor
        v-else-if="modalEdit"
        id="editor"
        ref="editor"
        :source-document="modalMarkdownContent === null ? '' : modalMarkdownContent"
        mode="markdown"
      />
      <div v-else @dblclick="modalEdit = true">
        <!-- eslint-disable-next-line -->
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
    <calendar v-else ref="calendar" :dates="data.dates" @dayclick="onDayClicked" />
  </protected>
</template>

<script>
import { SkiButton, SkiModal } from 'skimple-components'
import { marked } from 'marked'
import Protected from '~/components/Applications/Protected'
import Calendar from '~/components/Applications/Agenda/Calendar'
import PageHead from '~/components/Page/PageHead.vue'
import Spinner from '~/components/Spinner'
import TeacherNavigationEntry from '~/components/Page/Navigation/Entries/TeacherNavigationEntry'
import PageNavigationEntry from '~/components/Page/Navigation/Entries/PageNavigationEntry'
import ErrorDisplay from '~/components/ErrorDisplay.vue'
import CodeEditor from '~/components/Applications/Lessons/CodeEditor'

export default {
  components: { PageHead, PageNavigationEntry, TeacherNavigationEntry, Calendar, Protected, Spinner, SkiButton, SkiModal, ErrorDisplay, CodeEditor },
  data () {
    return {
      currentDate: null,
      modalLoading: false,
      modalMarkdownContent: null,
      modalEdit: false
    }
  },
  computed: {
    modalHtmlContent () {
      return this.modalMarkdownContent == null ? null : marked.parse(this.modalMarkdownContent)
    }
  },
  async mounted () {
    await this.$nextTick()
    this.$refs.dateModal.$el.addEventListener('show.bs.modal', async () => {
      document.querySelector('.page-header').style.zIndex = '1'
      this.$refs.modalBackdrop.classList.add('d-block')
      await new Promise(resolve => setTimeout(resolve, 1))
      this.$refs.modalBackdrop.classList.add('visible')
    })
    this.$refs.dateModal.$el.addEventListener('hide.bs.modal', async () => {
      this.$refs.modalBackdrop.classList.remove('visible')
      await new Promise(resolve => setTimeout(resolve, 150))
      document.querySelector('.page-header').style.zIndex = null
      this.$refs.modalBackdrop.classList.remove('d-block')
    })
  },
  methods: {
    async onDayClicked (yyyymmdd) {
      const bootstrap = await import('bootstrap/dist/js/bootstrap.min')
      this.currentDate = yyyymmdd
      const modal = new bootstrap.Modal(this.$refs.dateModal.$el)
      this.modalLoading = true
      modal.show()
      if (this.data.dates.includes(yyyymmdd)) {
        const response = await $fetch(`${this.$config.apiUrl}/calendar/get`, {
          params: {
            date: yyyymmdd
          },
          headers: accessTokenUtils.getAuthorizationHeaders()
        })
        this.modalMarkdownContent = response.content
      }
      this.modalLoading = false
    },
    async saveContent () {
      this.modalLoading = true
      this.modalMarkdownContent = this.$refs.editor.$data.document
      await $fetch(`${this.$config.apiUrl}/calendar/update`, {
        method: 'POST',
        body: {
          date: this.currentDate,
          content: this.modalMarkdownContent
        },
        headers: accessTokenUtils.getAuthorizationHeaders()
      })
      this.modalEdit = false
      this.modalLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
#editor {
  min-height: 200px;
}

#modal-backdrop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  transition: opacity 150ms;
  opacity: 0;

  &.visible {
    opacity: 0.5;
  }
}
</style>
