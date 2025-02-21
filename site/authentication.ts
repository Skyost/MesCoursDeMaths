/**
 * Represents authentication data for GitHub API / others.
 */
interface AuthenticationData {
  /**
   * Client ID for GitHub authentication.
   */
  clientId: string

  /**
   * Client secret for GitHub authentication.
   */
  clientSecret: string

  /**
   * Access token for GitHub authentication.
   */
  accessToken: string

  /**
   * Encryption key for securing sensitive data.
   */
  encryptionKey: string
}

/**
 * Object containing GitHub authentication data.
 */
export const authentication: AuthenticationData = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
  encryptionKey: process.env.ENCRYPTION_KEY!
}
