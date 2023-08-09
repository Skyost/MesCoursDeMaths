interface SiteMeta {
  title: string,
  description: string,
  author: string,
  url: string,
  apiUrl: string,
  github: {
    username: string,
    repository: string,
    dataRepository: string
  }
}

export const siteMeta: SiteMeta = {
  title: 'Mes cours de maths',
  description: 'Vous trouverez sur Mes Cours de Maths des cours de mathématiques gratuits à destination des collégiens ainsi que les activités qui y sont rattachées. Et bien sûr : tout est téléchargeable au format PDF !',
  author: 'Hugo Delaunay',
  url: 'https://mes-cours-de-maths.fr',
  apiUrl: 'https://vercel.mes-cours-de-maths.fr/api',
  github: {
    username: 'Skyost',
    repository: 'MesCoursDeMaths',
    dataRepository: 'Cours-HD'
  }
}
