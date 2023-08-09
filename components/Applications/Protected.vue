<script lang="ts" setup>
import { oauthAuthorizationUrl } from '@octokit/oauth-authorization-url'
import { siteMeta } from '~/site/meta'

const accessToken = useAccessToken()
const runtimeConfig = useRuntimeConfig()

const { url: oauthUrl } = oauthAuthorizationUrl({
  clientType: 'oauth-app',
  clientId: runtimeConfig.public.githubClientId,
  redirectUrl: `${runtimeConfig.public.apiUrl}/user/login`,
  login: siteMeta.github.username,
  scopes: ['repo']
})
</script>

<template>
  <div>
    <Title>Espace protégé</Title>
    <slot v-if="accessToken" />
    <div v-else>
      <div class="text-center">
        <img class="avatar" :src="`https://github.com/${siteMeta.github.username}.png`" alt="Github">
      </div>
      <div class="alert alert-primary d-flex align-items-center" role="alert">
        <ski-icon icon="person-fill" class="fs-2" />
        <div class="ms-2">
          Vous devez vous connecter via Github pour continuer.
          <br><strong>Attention.</strong> Vous devez avoir accès au dépôt <code v-text="`${siteMeta.github.username}/${siteMeta.github.dataRepository}`" />.
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

<style lang="scss" scoped>
.avatar {
  width: 200px;
  max-width: 100%;
  border-radius: 50%;
  margin-bottom: 20px;
}
</style>
