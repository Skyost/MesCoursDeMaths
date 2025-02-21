<script setup lang="ts">
const props = defineProps<{
  error: any
  changeTitle?: boolean
}>()

const errorCode = computed(() => {
  if (/^-?\d+$/.test(props.error.toString())) {
    return parseInt(props.error.toString())
  }
  if (Object.prototype.hasOwnProperty.call(props.error, 'statusCode')) {
    return parseInt(props.error.statusCode)
  }
  return null
})

const title = computed(() => {
  if (errorCode.value === 404) {
    return 'Page non trouvée !'
  }
  if (errorCode.value) {
    return `Erreur ${errorCode.value}`
  }
  return 'Erreur'
})

const goBack = () => window.history.back()
</script>

<template>
  <div>
    <Title v-if="changeTitle">
      {{ title }}
    </Title>
    <h1 v-text="title" />
    <p>
      Vous pouvez continuer votre navigation en allant sur <a
        href="#"
        @click.prevent="goBack"
      >
        la page précédente
      </a> ou
      en allant sur <nuxt-link to="/">la page d'accueil</nuxt-link>.
      <span v-if="errorCode === 404">
        Si quelque chose devait se trouver ici, n'hésitez pas à me contacter pour me le signaler.
      </span>
    </p>
  </div>
</template>
