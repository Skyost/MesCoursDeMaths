<template>
  <protected>
    <div class="file-browser">
      <div class="text-end">
        <ski-button v-if="exception" variant="light" @click.native="refreshFileList">
          <ski-icon icon="arrow-clockwise" /> Recharger
        </ski-button>
        <ski-button v-if="currentDirectory.length !== 0 && currentFile === null && !loading" variant="light" @click.native="goToParent">
          <ski-icon icon="arrow-90deg-up" /> Dossier parent
        </ski-button>
        <ski-button v-if="currentFile === null && !loading" variant="light" @click.native="createNewFile">
          <ski-icon icon="file-earmark-plus-fill" /> Nouveau
        </ski-button>
        <file-upload-button v-if="currentFile === null && !loading" icon="cloud-upload-fill" text="Uploader" accept=".tex" @fileloaded="onFileLoaded" />
        <ski-button v-if="currentFile !== null && !loading" variant="light" @click.native="saveFileContent(currentFile.path, window.btoa($refs.editor.$data.document), currentFile.sha)">
          <ski-icon icon="cloud-download-fill" /> Enregistrer
        </ski-button>
        <ski-button v-if="currentFile !== null && !loading" variant="light" @click.native="currentFile = null">
          <ski-icon icon="x-lg" /> Fermer
        </ski-button>
      </div>
      <h1>Cours</h1>
      <div v-if="exception" class="p-5 text-center">
        <p v-text="exception" />
        <ski-button variant="link" @click="refreshFileList">
          Recharger
        </ski-button>
      </div>
      <div v-else-if="loading" class="mt-5 mb-5 text-center">
        <spinner />
      </div>
      <div
        v-else-if="currentFile != null"
        class="code-editor-parent"
      >
        <code-editor
          ref="editor"
          class="code-editor"
          :source-document="currentFileContent"
        />
      </div>
      <div v-else>
        <div
          v-if="currentDirectory.length !== 0"
          class="item"
          @click="goToParent"
        >
          <ski-icon icon="arrow-90deg-up" />
          Dossier parent
        </div>
        <div v-for="(file, index) in fileList" :key="index" class="d-flex">
          <div class="item flex-grow-1" @click="onFileClicked(file)">
            <ski-icon :icon="file.type === 'dir' ? 'folder-fill' : 'file-earmark-fill'" />
            {{ file.name }}
          </div>
          <ski-button variant="success" @click="renameFile(file)">
            <ski-icon icon="cursor-text" />
          </ski-button>
          <ski-button variant="danger" @click="deleteFile(file)">
            <ski-icon icon="trash-fill" />
          </ski-button>
        </div>
        <span class="d-block text-end text-muted p-3" v-text="currentPath" />
      </div>
    </div>
  </protected>
</template>

<script>
import { SkiButton, SkiIcon } from 'skimple-components'
import CodeEditor from '~/components/Applications/Lessons/CodeEditor'
import Protected from '~/components/Applications/Protected'
import Spinner from '~/components/Spinner'
import FileUploadButton from '~/components/Applications/FileUploadButton'
import accessTokenUtils from '~/utils/access-token'

export default {
  components: { FileUploadButton, CodeEditor, Protected, Spinner, SkiIcon, SkiButton },
  data () {
    return {
      loading: true,
      fileList: null,
      currentDirectory: '',
      currentFile: null,
      exception: null
    }
  },
  fetchOnServer: false,
  async fetch () {
    await this.refreshFileList()
  },
  head: {
    title: 'Cours'
  },
  computed: {
    currentPath () {
      return '/' + this.currentDirectory + (this.currentFile === null ? '' : this.currentFile.path)
    },
    currentFileContent () {
      if (!this.currentFile) {
        return null
      }
      return this.base64Decode(this.currentFile.content)
    }
  },
  methods: {
    async onFileLoaded (data) {
      const name = window.prompt('Entrer le nom du fichier.', data.file.name)
      if (this.isFileNameValid(name)) {
        await this.saveFileContent(this.currentDirectory + name, data.content.split(',')[1])
        await this.refreshFileList()
      } else {
        window.alert('Nom de fichier invalide !')
      }
    },
    async createNewFile () {
      const name = window.prompt('Entrer le nom du fichier.', '.tex')
      if (this.isFileNameValid(name)) {
        await this.saveFileContent(this.currentDirectory + name, '')
        await this.refreshFileList()
      } else {
        window.alert('Nom de fichier invalide !')
      }
    },
    async renameFile (file) {
      const name = window.prompt('Entrer le nom du fichier.', this.currentDirectory.length === 0 ? file.path : file.path.substring(0, file.path.lastIndexOf('/')))
      if (!this.isFileNameValid(name)) {
        window.alert('Nom de fichier invalide !')
        return
      }
      await this.request(async () => {
        await this.$axios.$get(`${this.$config.apiUrl}/lessons/rename`, {
          params: {
            name,
            path: file.path,
            sha: file.sha
          },
          headers: accessTokenUtils.getAuthorizationHeaders(this.$cookies)
        })
      })
      await this.refreshFileList()
    },
    async deleteFile (file) {
      await this.request(async () => {
        await this.$axios.$get(`${this.$config.apiUrl}/lessons/delete`, {
          params: {
            path: file.path,
            sha: file.sha
          }
        })
      }, {
        headers: accessTokenUtils.getAuthorizationHeaders(this.$cookies)
      })
    },
    async saveFileContent (path, content, sha) {
      const data = { path, content }
      if (sha) {
        data.sha = sha
      }
      await this.request(async () => {
        await this.$axios.$post(`${this.$config.apiUrl}/lessons/update`, data, {
          headers: accessTokenUtils.getAuthorizationHeaders(this.$cookies)
        })
      })
    },
    async refreshFileList () {
      this.fileList = null
      this.exception = null
      await this.request(async () => {
        this.fileList = await this.$axios.$get(`${this.$config.apiUrl}/lessons/list`, {
          params: {
            path: this.currentDirectory
          },
          headers: accessTokenUtils.getAuthorizationHeaders(this.$cookies)
        })
      })
    },
    goToParent () {
      const trueLastSeparatorIndex = this.currentDirectory.substring(0, this.currentDirectory.length - 1).lastIndexOf('/') + 1
      this.currentDirectory = this.currentDirectory.substring(0, trueLastSeparatorIndex)
      this.refreshFileList()
    },
    async onFileClicked (data) {
      switch (data.type) {
        case 'dir':
          this.currentDirectory = data.path
          await this.refreshFileList()
          break
        case 'file':
          await this.request(async () => {
            this.currentFile = await this.$axios.$get(`${this.$config.apiUrl}/lessons/get`, {
              params: {
                path: data.path
              },
              headers: accessTokenUtils.getAuthorizationHeaders(this.$cookies)
            })
          })
      }
    },
    async request (callback) {
      this.loading = true
      try {
        await callback()
      } catch (exception) {
        this.exception = exception
      }
      this.loading = false
    },
    isFileNameValid (fileName) {
      if (!fileName || fileName.includes('/') || !this.fileList) {
        return false
      }

      for (const file of this.fileList) {
        if (file.name === fileName) {
          return false
        }
      }

      return true
    },
    base64Decode (string) {
      return decodeURIComponent(atob(string).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    }
  }
}
</script>

<style lang="scss" scoped>
.file-browser {
  min-height: 100%;
  position: relative;

  .item {
    padding: 10px 30px;
    font-size: 1.2em;
    background-color: rgba(black, 0.05);
    cursor: pointer;

    &:hover {
      background-color: rgba(black, 0.1);
    }
  }

  .code-editor-parent {
    position: relative;
    width: 100%;
    min-height: 300px;

    .code-editor {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-top: 1px solid rgba(black, 0.1);
    }
  }
}
</style>
