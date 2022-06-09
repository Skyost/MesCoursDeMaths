<template>
  <protected>
    <teacher-navigation-entry />
    <div class="text-end">
      <ski-button variant="light" @click.native="logout">
        <ski-icon icon="box-arrow-left" /> Déconnexion
      </ski-button>
    </div>
    <h1>Accès enseignant</h1>
    <ski-columns class="justify-content-center">
      <ski-column
        v-for="application in applications"
        :key="application.id"
        xs="12"
        md="6"
        lg="4"
        class="mt-3"
      >
        <image-card
          :title="application.title"
          :color="application.color"
          :subtitle="application.subtitle"
          :to="application.url"
          :image="application.image"
        />
      </ski-column>
    </ski-columns>
  </protected>
</template>

<script>
import { SkiButton, SkiColumn, SkiColumns, SkiIcon } from 'skimple-components'
import Protected from '~/components/Applications/Protected'
import site from '~/site'
import accessTokenUtils from '~/utils/access-token'
import TeacherNavigationEntry from '~/components/Page/Navigation/Entries/TeacherNavigationEntry'

export default {
  components: { TeacherNavigationEntry, SkiColumns, SkiColumn, SkiButton, SkiIcon, Protected },
  data () {
    return {
      applications: [
        {
          id: 'whiteboard',
          title: 'Tableau blanc',
          subtitle: 'Application',
          color: 'red',
          url: '/prof/tableau-blanc/',
          image: '/images/applications/whiteboard.svg'
        },
        {
          id: 'agenda',
          title: 'Agenda',
          subtitle: 'Application',
          color: 'blue',
          url: '/prof/agenda/',
          image: '/images/applications/agenda.svg'
        },
        {
          id: 'cours',
          title: 'Cours',
          subtitle: 'Application',
          color: 'teal',
          url: '/prof/cours/',
          image: '/images/applications/lessons.svg'
        }
      ]
    }
  },
  head: {
    title: 'Accès enseignant'
  },
  mounted () {
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'access_token')) {
      let expiration
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'expiration')) {
        expiration = new Date(parseInt(this.$route.query.expiration.toString()))
      } else {
        expiration = new Date()
        expiration.setDate(expiration.getDate() + site.github.authentication.cookieExpirationDays)
      }
      accessTokenUtils.storeAccessTokenInCookies(this.$cookies, this.$route.query.access_token, expiration)
      window.location.href = '/prof'
    }
  },
  methods: {
    logout () {
      accessTokenUtils.removeAccessTokenFromCookies(this.$cookies)
      window.location.href = '/prof'
    }
  }
}
</script>

<style lang="scss" scoped>
#logo {
  height: 1em;
  vertical-align: -0.12em;
}
</style>
