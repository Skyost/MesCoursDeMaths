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
  }
}
