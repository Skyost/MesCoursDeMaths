<script lang="ts">
export const teacherNavigationEntry = {
  title: 'Accès enseignant',
  to: '/prof/',
  depth: 0
}
</script>

<script setup lang="ts">
import { cookieExpirationDays } from '~/site/cookie'
import Protected from '~/components/Applications/Protected.vue'

const applications = [
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
    id: 'lessons',
    title: 'Cours',
    subtitle: 'Application',
    color: 'teal',
    url: '/prof/cours/',
    image: '/images/applications/lessons.svg'
  }
]

const logout = () => {
  const accessToken = useAccessToken()
  accessToken.value = null
  location.reload()
}

onMounted(async () => {
  await nextTick()
  const route = useRoute()
  if ('access_token' in route.query) {
    let expiration
    if ('expiration' in route.query) {
      expiration = new Date(parseInt(route.query.expiration!.toString()))
    }
    else {
      expiration = new Date()
      expiration.setDate(expiration.getDate() + cookieExpirationDays)
    }

    const accessToken = useAccessToken(expiration)
    accessToken.value = route.query.access_token!.toString()

    const router = useRouter()
    await router.replace({ path: route.path.endsWith('/') ? route.path : (route.path + '/'), query: undefined })
    location.reload()
  }
})

useNavigationEntry(teacherNavigationEntry)
</script>

<template>
  <div>
    <protected>
      <page-head title="Accès enseignant" />
      <div class="text-end mb-3">
        <b-button
          variant="light"
          @click="logout"
        >
          <icon name="bi:box-arrow-left" /> Déconnexion
        </b-button>
      </div>
      <h1>Accès enseignant</h1>
      <b-row class="justify-content-center">
        <b-col
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
        </b-col>
      </b-row>
    </protected>
  </div>
</template>

<style lang="scss" scoped>
#logo {
  height: 1em;
  vertical-align: -0.12em;
}
</style>
