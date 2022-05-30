<template>
  <div>
    <h1 v-text="title" />
    <p>
      Vous pouvez continuer votre navigation en allant sur <a href="javascript:history.back()">la page précédente</a> ou
      en allant sur <nuxt-link to="/">la page d'accueil</nuxt-link>.
      <span v-if="errorCode === 404">
        Si quelque chose devait se trouver ici, n'hésitez pas à me contacter pour me le signaler.
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ErrorDisplay',
  props: {
    errorCode: {
      type: Number,
      default: 500
    }
  },
  computed: {
    title () {
      return this.errorCode === 404 ? 'Page non trouvée !' : `Erreur ${this.statusCode}`
    }
  }
}
</script>
