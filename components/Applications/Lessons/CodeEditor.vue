<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'

const props = defineProps<{ sourceDocument: string }>()

// eslint-disable-next-line vue/no-setup-props-destructure
const document = ref(props.sourceDocument)
defineExpose({ document })
</script>

<template>
  <codemirror v-model="document" />
</template>
