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
  props: {
    error: {
      type: null,
      required: true
    }
  },
  computed: {
    errorCode () {
      if (/^-?\d+$/.test(this.error.toString())) {
        return parseInt(this.error.toString())
      }
      if (Object.prototype.hasOwnProperty.call(this.error, 'statusCode')) {
        return parseInt(this.error.statusCode)
      }
      return null
    },
    title () {
      const errorCode = this.errorCode
      if (errorCode === 404) {
        return 'Page non trouvée !'
      }
      if (errorCode) {
        return `Erreur ${errorCode}`
      }
      return 'Erreur'
    }
  }
}
</script>
