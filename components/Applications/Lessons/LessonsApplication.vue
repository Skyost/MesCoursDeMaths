<script setup lang="ts">
import btoa from '@node-fetch/btoa-lite'
import type { FileContent } from '~/components/Applications/FileUploadButton.vue'
import FileUploadButton from '~/components/Applications/FileUploadButton.vue'
import CodeEditor from '~/components/Applications/Lessons/CodeEditor.vue'
import BackToApplications from '~/components/Applications/BackToApplications.vue'
import Control from '~/components/Controls/Control.vue'
import type { APILessonsListEntry } from '~/vercel/api/lessons/list'
import type { APILessonsGetEntry } from '~/vercel/api/lessons/get'
import { base64Decode } from '~/utils/utils'

const runtimeConfig = useRuntimeConfig()
const authorizationHeaders = useAuthorizationHeaders()

const loading = ref<boolean>(true)
const fileList = ref<APILessonsListEntry[] | null>(null)
const currentDirectory = ref<string>('')
const currentFile = ref<APILessonsGetEntry | null>(null)
const exception = ref<any>(null)
const editor = ref<InstanceType<typeof CodeEditor> | null>(null)

const currentPath = computed(() => '/' + currentDirectory.value + (currentFile.value ? currentFile.value.path : ''))
const currentFileContent = computed(() => currentFile.value ? base64Decode(currentFile.value.content) : '')

const onFileLoaded = async (event: FileContent) => {
  const name = window.prompt('Entrer le nom du fichier.', event.file.name)
  if (!name) {
    return
  }

  if (isFilenameValid(name)) {
    await saveFileContent(currentDirectory.value + name, event.content.split(',')[1])
    await refreshFileList()
  }
  else {
    window.alert('Nom de fichier invalide !')
  }
}

const createNewFile = async () => {
  const name = window.prompt('Entrer le nom du fichier.', '.tex')
  if (!name) {
    return
  }

  if (isFilenameValid(name)) {
    await saveFileContent(currentDirectory.value + name, '')
    await refreshFileList()
  }
  else {
    window.alert('Nom de fichier invalide !')
  }
}

const renameFile = async (file: APILessonsListEntry) => {
  const name = window.prompt('Entrer le nom du fichier.', currentDirectory.value.length === 0 ? file.path : file.path.substring(0, file.path.lastIndexOf('/')))
  if (!name) {
    return
  }

  if (!isFilenameValid(name)) {
    window.alert('Nom de fichier invalide !')
    return
  }
  await request(async () => {
    await $fetch(`${runtimeConfig.public.apiUrl}/lessons/rename`, {
      params: {
        name,
        path: file.path,
        sha: file.sha
      },
      headers: authorizationHeaders.value
    })
  })
  await refreshFileList()
}

const deleteFile = async (file: APILessonsListEntry) => {
  await request(async () => {
    await $fetch(`${runtimeConfig.public.apiUrl}/lessons/delete`, {
      params: {
        path: file.path,
        sha: file.sha
      },
      headers: authorizationHeaders.value
    })
  })
}

const saveFileContent = async (path: string, content: string, sha?: string) => {
  await request(async () => {
    await $fetch(`${runtimeConfig.public.apiUrl}/lessons/update`, {
      method: 'POST',
      body: { path, content, sha: sha ?? '' },
      headers: authorizationHeaders.value
    })
  })
}

const refreshFileList = async () => {
  fileList.value = null
  exception.value = null
  await request(async () => {
    fileList.value = await $fetch<APILessonsListEntry[]>(`${runtimeConfig.public.apiUrl}/lessons/list`, {
      params: {
        path: currentDirectory.value
      },
      headers: authorizationHeaders.value
    })
  })
}

const goToParent = async () => {
  const trueLastSeparatorIndex = currentDirectory.value.substring(0, currentDirectory.value.length - 1).lastIndexOf('/') + 1
  currentDirectory.value = currentDirectory.value.substring(0, trueLastSeparatorIndex)
  await refreshFileList()
}

const onFileClicked = async (data: APILessonsListEntry) => {
  switch (data.type) {
    case 'dir':
      currentDirectory.value = data.path
      await refreshFileList()
      break
    case 'file':
      await request(async () => {
        currentFile.value = await $fetch<APILessonsGetEntry>(`${runtimeConfig.public.apiUrl}/lessons/get`, {
          params: {
            path: data.path
          },
          headers: authorizationHeaders.value
        })
      })
  }
}

const request = async (callback: () => Promise<any>) => {
  loading.value = true
  try {
    await callback()
  }
  catch (ex: any) {
    exception.value = ex
  }
  loading.value = false
}

const isFilenameValid = (filename: string | null) => {
  if (!filename || filename.includes('/') || !fileList.value) {
    return false
  }

  for (const file of fileList.value) {
    if (file.name === filename) {
      return false
    }
  }

  return true
}

onMounted(refreshFileList)
</script>

<template>
  <div class="file-browser">
    <controls>
      <controls-section>
        <controls-section-title />
        <back-to-applications />
        <control
          v-if="currentDirectory.length !== 0 && currentFile === null && !loading"
          icon-id="arrow-90deg-up"
          text="Dossier parent"
          @click="goToParent"
        />
      </controls-section>
      <controls-section v-if="exception || !loading">
        <controls-section-title
          title="Opérations"
          icon-id="mouse"
        />
        <control
          v-if="exception"
          icon-id="arrow-clockwise"
          text="Recharger"
          @click="refreshFileList"
        />
        <control
          v-if="currentFile === null && !loading"
          icon-id="file-earmark-plus-fill"
          text="Nouveau"
          @click="createNewFile"
        />
        <file-upload-button
          v-if="currentFile === null && !loading"
          icon-id="cloud-upload-fill"
          text="Uploader"
          accept=".tex"
          @loaded="onFileLoaded"
        />
        <control
          v-if="currentFile !== null && !loading"
          icon-id="cloud-download-fill"
          text="Enregistrer"
          @click="saveFileContent(currentFile.path, btoa(editor!.document), currentFile.sha)"
        />
        <control
          v-if="currentFile !== null && !loading"
          icon-id="x-lg"
          text="Fermer"
          @click="currentFile = null"
        />
      </controls-section>
    </controls>
    <h1>Cours</h1>
    <div
      v-if="exception"
      class="p-5 text-center"
    >
      <p v-text="exception" />
      <b-button
        variant="link"
        @click="refreshFileList"
      >
        Recharger
      </b-button>
    </div>
    <div
      v-else-if="loading"
      class="mt-5 mb-5 text-center"
    >
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
        <icon name="bi:arrow-90deg-up" /> Dossier parent
      </div>
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="d-flex"
      >
        <div
          class="item flex-grow-1"
          @click="onFileClicked(file)"
        >
          <icon :name="file.type === 'dir' ? 'bi:folder-fill' : 'bi:file-earmark-fill'" /> {{ file.name }}
        </div>
        <b-button
          variant="success"
          @click="renameFile(file)"
        >
          <icon name="bi:cursor-text" />
        </b-button>
        <b-button
          variant="danger"
          @click="deleteFile(file)"
        >
          <icon name="bi:trash-fill" />
        </b-button>
      </div>
      <span
        class="d-block text-end text-muted p-3"
        v-text="currentPath"
      />
    </div>
  </div>
</template>

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
      inset: 0;
      border-top: 1px solid rgba(black, 0.1);
    }
  }
}
</style>
