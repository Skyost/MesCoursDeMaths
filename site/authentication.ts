/**
 * Represents authentication data for GitHub API / others.
 * @interface
 */
interface AuthenticationData {
  /**
   * Client ID for GitHub authentication.
   * @type {string}
   */
  clientId: string

  /**
   * Client secret for GitHub authentication.
   * @type {string}
   */
  clientSecret: string

  /**
   * Access token for GitHub authentication.
   * @type {string}
   */
  accessToken: string

  /**
   * Encryption key for securing sensitive data.
   * @type {string}
   */
  encryptionKey: string
}

/**
 * Object containing GitHub authentication data.
 * @const {AuthenticationData}
 * @export
 */
export const authentication: AuthenticationData = {
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
  encryptionKey: process.env.ENCRYPTION_KEY!
}
