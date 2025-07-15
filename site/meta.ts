/**
 * Represents metadata for the website.
 */
interface SiteMeta {
  /**
   * Title of the website.
   */
  title: string

  /**
   * Description of the website.
   */
  description: string

  /**
   * Author of the website.
   */
  author: string

  /**
   * URL of the website.
   */
  url: string

  /**
   * Vercel API URL associated with the website.
   */
  apiUrl: string

  /**
   * GitHub information for the website.
   */
  github: {
    username: string
    repository: string
    dataRepository: string
  }

  /**
   * The contact settings.
   */
  contact: {
    url: string
    recaptchaKey: string
  }
}

/**
 * Metadata object for the website.
 */
export const siteMeta: SiteMeta = {
  title: 'Mes cours de maths',
  description: 'Vous trouverez sur Mes Cours de Maths des cours de mathématiques gratuits à destination des collégiens et des lycéens ainsi que les activités qui y sont rattachées. Et bien sûr : tout est téléchargeable au format PDF !',
  author: 'Hugo Delaunay',
  url: 'https://mes-cours-de-maths.fr',
  apiUrl: 'https://vercel.mes-cours-de-maths.fr/api',
  github: {
    username: 'Skyost',
    repository: 'MesCoursDeMaths',
    dataRepository: 'Cours-HD'
  },
  contact: {
    url: 'https://script.google.com/macros/s/AKfycbx0uW7dE9r8IlG4vNzw5H1eJyNo9EJqkbL0pq3NR25j7xnAj6DAaP79n0R_xnSwUL1mig/exec',
    recaptchaKey: '6Ldre4QrAAAAABWBKtFDmndRv0SmPDB2ZZqz_l8N'
  }
}
