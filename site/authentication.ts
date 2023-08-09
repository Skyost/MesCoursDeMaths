interface AuthenticationData {
  clientId: string,
  clientSecret: string,
  accessToken: string,
  encryptionKey: string
}

export const authentication: AuthenticationData = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
  encryptionKey: process.env.ENCRYPTION_KEY!
}
