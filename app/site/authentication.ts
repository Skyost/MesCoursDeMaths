/**
 * Object containing GitHub authentication data.
 */
export default {
  /**
   * The GitHub personal access token retrieved from the environment variables.
   * This token is typically used to authenticate API requests made to GitHub services.
   */
  accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!
}
