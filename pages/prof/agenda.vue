<template>
  <protected>
    <h1>Agenda</h1>
    <ski-modal
      id="date-modal"
      ref="dateModal"
      :title="currentDate === null ? null : currentDate.toLocaleString('default', { day: 'numeric', month: 'numeric', year: 'numeric' })"
      :close-button="null"
      size="lg"
      data-bs-backdrop="static"
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
          @click.native="modalEdit = false"
        >
          Fermer
        </ski-button>
      </template>
    </ski-modal>
    <calendar ref="calendar" :dates="dates" @dayclick="onDayClicked" />
  </protected>
</template>

<script>
import { SkiButton, SkiModal } from 'skimple-components'
import { marked } from 'marked'
import Protected from '~/components/Applications/Protected'
import Calendar from '~/components/Applications/Agenda/Calendar'
import CodeEditor from '~/components/Applications/Lessons/CodeEditor'
import Spinner from '~/components/Spinner'

export default {
  components: { CodeEditor, Calendar, Protected, Spinner, SkiButton, SkiModal },
  data () {
    return {
      currentDate: null,
      modalLoading: false,
      modalMarkdownContent: null,
      modalEdit: false,
      dates: []
    }
  },
  async fetch () {
    this.dates = (await this.$axios.$get('/api/calendar/dates')).dates.map(function (date) {
      const result = new Date(date)
      result.setHours(0)
      return result
    })
  },
  head: {
    title: 'Agenda'
  },
  computed: {
    modalHtmlContent () {
      return this.modalMarkdownContent == null ? null : marked.parse(this.modalMarkdownContent)
    }
  },
  methods: {
    async onDayClicked (date) {
      const bootstrap = await import('bootstrap/dist/js/bootstrap.min')
      this.currentDate = date
      const modal = new bootstrap.Modal(this.$refs.dateModal.$el)
      this.modalLoading = true
      modal.show()
      if (this.dates.find(remoteDate => remoteDate.getTime() === date.getTime())) {
        const response = await this.$axios.$get('/api/calendar/get', {
          params: {
            date: this.formatDate(date)
          }
        })
        this.modalMarkdownContent = response.content
      }
      this.modalLoading = false
    },
    async saveContent () {
      this.modalLoading = true
      this.modalMarkdownContent = this.$refs.editor.$data.document
      await this.$axios.$post('/api/calendar/update', {
        date: this.formatDate(this.currentDate),
        content: this.modalMarkdownContent
      })
      this.modalEdit = false
      this.modalLoading = false
    },
    formatDate (date) {
      const offset = date.getTimezoneOffset()
      const result = new Date(date.getTime() - (offset * 60 * 1000))
      return result.getFullYear() + '-' + ('0' + (result.getMonth() + 1)).slice(-2) + '-' + ('0' + result.getDate()).slice(-2)
    }
  }
}
</script>

<style lang="scss" scoped>
#editor {
  min-height: 200px;
}
</style>
