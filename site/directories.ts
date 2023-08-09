export interface SiteDirectories {
  lessonsDirectory: string,
  calendarFile: string,
  downloadDirectory: string
}

export const siteDirectories: SiteDirectories = {
  lessonsDirectory: 'latex/',
  calendarFile: 'calendar.json',
  downloadDirectory: process.env.GITHUB_DOWNLOAD_DIRECTORY || __dirname
}
