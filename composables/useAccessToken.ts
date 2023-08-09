export const useAccessToken = (expiration?: Date) => useCookie<string | null>(
  'access_token',
  {
    default: () => null,
    path: '/',
    expires: expiration,
    sameSite: 'lax',
    secure: true
  }
)

export const useAuthorizationHeaders = () => computed(() => {
  return {
    Authorization: `Bearer ${useAccessToken().value}`
  }
})
