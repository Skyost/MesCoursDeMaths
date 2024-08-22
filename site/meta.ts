/**
 * Represents metadata for the website.
 * @interface
 */
interface SiteMeta {
  /**
   * Title of the website.
   * @type {string}
   */
  title: string

  /**
   * Description of the website.
   * @type {string}
   */
  description: string

  /**
   * Author of the website.
   * @type {string}
   */
  author: string

  /**
   * URL of the website.
   * @type {string}
   */
  url: string

  /**
   * Vercel API URL associated with the website.
   * @type {string}
   */
  apiUrl: string

  /**
   * GitHub information for the website.
   * @type {{ username: string, repository: string, dataRepository: string }}
   */
  github: {
    username: string
    repository: string
    dataRepository: string
  }
}

/**
 * Metadata object for the website.
 * @const {SiteMeta}
 * @export
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
