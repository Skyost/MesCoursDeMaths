<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'

const props = defineProps<{ sourceDocument: string }>()

const document = ref(props.sourceDocument)
defineExpose({ document })
</script>

<template>
  <codemirror v-model="document" />
</template>
