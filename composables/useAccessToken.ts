import type { Ref } from 'vue'

/**
 * Custom Vue composable to manage and retrieve the access token.
 * @param expiration Optional expiration date for the access token.
 * @returns The reactive reference to the access token.
 */
export const useAccessToken = (expiration?: Date): Ref<string | null> => useCookie<string | null>(
  'access_token',
  {
    default: () => null,
    path: '/',
    expires: expiration,
    sameSite: 'lax',
    secure: true
  }
)

/**
 * Custom Vue composable to generate authorization headers using the access token.
 * @returns The reactive reference to the authorization headers.
 */
export const useAuthorizationHeaders = (): Ref<{ Authorization: string }> => computed(() => {
  return {
    Authorization: `Bearer ${useAccessToken().value}`
  }
})
