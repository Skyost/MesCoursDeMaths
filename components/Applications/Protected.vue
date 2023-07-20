<template>
  <div>
    <Title>Espace protégé</Title>
    <slot v-if="hasToken" />
    <div v-else>
      <div class="text-center">
        <img class="avatar" :src="avatarUrl" alt="Github">
      </div>
      <div class="alert alert-primary d-flex align-items-center" role="alert">
        <ski-icon icon="person-fill" class="fs-2" />
        <div class="ms-2">
          Vous devez vous connecter via Github pour continuer.
          <br><strong>Attention.</strong> Vous devez avoir accès au dépôt <code v-text="dataRepository" />.
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
import siteMeta from '~/site/meta'
import accessTokenUtils from '~/utils/access-token'

export default {
  components: { SkiButton, SkiIcon },
  data () {
    return {
      hasToken: false
    }
  },
  computed: {
    oauthUrl () {
      const { url } = oauthAuthorizationUrl({
        clientType: 'oauth-app',
        clientId: this.$config.githubClientId,
        redirectUrl: `${this.$config.apiUrl}/user/login`,
        login: siteMeta.github.username,
        scopes: ['repo']
      })
      return url
    },
    avatarUrl () {
      return `https://github.com/${siteMeta.github.username}.png`
    },
    dataRepository () {
      return `${siteMeta.github.username}/${siteMeta.github.dataRepository}`
    }
  },
  mounted () {
    if (process.client) {
      this.hasToken = accessTokenUtils.isAccessTokenInCookies()
    }
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
