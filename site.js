export default {
  site: {
    title: 'Mes cours de maths',
    tagline: 'Les cours de mathématiques de M. Delaunay, disponibles en ligne.',
    description: 'Petit site web où je mets tous mes cours à disposition ainsi que les ressources qui y sont liés.',
    author: 'Hugo Delaunay',
    url: process.env.DEBUG_MODE === 'true' ? 'http://localhost:3000' : 'https://mes-cours-de-maths.fr',
    apiUrl: process.env.DEBUG_MODE === 'true' ? 'http://localhost:3000/api' : 'https://mes-cours-de-maths.vercel.app/api'
  },
  github: {
    username: 'Skyost',
    repository: 'MesCoursDeMaths',
    dataRepository: 'Cours-HD',
    authentication: {
      clientId: '9b549b66b9ffee93fa55',
      accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    },
    lessonsDirectory: 'latex/',
    downloadDirectory: process.env.GITHUB_DOWNLOAD_DIRECTORY || __dirname
  },
  debug: process.env.DEBUG_MODE === 'true' || false,
  contentGenerator: {
    pdfDestination: '/pdf',
    imagesDestination: '/images/lessons',
    fileNameFilter: (fileName) => {
      if (fileName.endsWith('-cours')) {
        return fileName.substring(0, fileName.length - '-cours'.length)
      }
      return fileName
    },
    shouldGenerateMarkdown: fileName => fileName.endsWith('-cours'),
    shouldGeneratePDF: () => true,
    ignored: [
      'latex/sixieme/eleve.tex',
      'latex/sixieme/geogebra.tex',
      'latex/sixieme/groupes.tex',
      'latex/sixieme/impression.tex',
      'latex/sixieme/scratch.tex'
    ]
  }
}
