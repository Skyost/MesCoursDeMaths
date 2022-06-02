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
import Spinner from '~/components/Spinner'
import site from '~/site'

export default {
  components: { Calendar, Protected, Spinner, SkiButton, SkiModal },
  data () {
    return {
      currentDate: null,
      modalLoading: false,
      modalMarkdownContent: null,
      modalEdit: false,
      dates: []
    }
  },
  fetchOnServer: false,
  async fetch () {
    const response = await this.$axios.$get(`${site.site.apiUrl}/calendar/dates`)
    if (response) {
      this.dates = response.dates
    }
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
    async onDayClicked (yyyymmdd) {
      const bootstrap = await import('bootstrap/dist/js/bootstrap.min')
      this.currentDate = yyyymmdd
      const modal = new bootstrap.Modal(this.$refs.dateModal.$el)
      this.modalLoading = true
      modal.show()
      if (this.dates.includes(yyyymmdd)) {
        const response = await this.$axios.$get(`${site.site.apiUrl}/calendar/get`, {
          params: {
            date: yyyymmdd
          }
        })
        this.modalMarkdownContent = response.content
      }
      this.modalLoading = false
    },
    async saveContent () {
      this.modalLoading = true
      this.modalMarkdownContent = this.$refs.editor.$data.document
      await this.$axios.$post(`${site.site.apiUrl}/calendar/update`, {
        date: this.currentDate,
        content: this.modalMarkdownContent
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
</style>
