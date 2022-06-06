<template>
  <div>
    <slot v-if="token" />
    <div v-else>
      <div class="text-center">
        <img class="avatar" :src="avatarUrl" alt="Github">
      </div>
      <div class="alert alert-primary d-flex align-items-center" role="alert">
        <ski-icon icon="person-fill" class="fs-2" />
        <div class="ms-2">
          Vous devez vous connecter via Github pour continuer.
          <br><strong>Attention.</strong> Vous devenez avoir accès au dépôt <code v-text="dataRepository" />.
        </div>
      </div>
      <div class="text-center mt-3 mb-5">
        <ski-button
          class="d-inline-flex align-items-center btn-lg"
          type="submit"
          :href="oauthUrl"
        >
          <ski-icon icon="github" />
          <span class="ms-2">Connexion avec Github</span>
        </ski-button>
      </div>
    </div>
  </div>
</template>

<script>
import { SkiButton, SkiIcon } from 'skimple-components'
import { oauthAuthorizationUrl } from '@octokit/oauth-authorization-url'
import site from '~/site'

export default {
  name: 'Protected',
  components: { SkiButton, SkiIcon },
  data () {
    return {
      token: null,
      error: null
    }
  },
  computed: {
    oauthUrl () {
      const { url } = oauthAuthorizationUrl({
        clientType: 'oauth-app',
        clientId: this.$config.githubClientId,
        redirectUrl: `${this.$config.apiUrl}/user/login`,
        login: site.github.username,
        scopes: ['repo']
      })
      return url
    },
    avatarUrl () {
      return `https://github.com/${site.github.username}.png`
    },
    dataRepository () {
      return `${site.github.username}/${site.github.dataRepository}`
    }
  },
  mounted () {
    this.token = this.$cookies.get('access_token')
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 200px;
  max-width: 100%;
  border-radius: 50%;
  margin-bottom: 20px;
}
</style>
