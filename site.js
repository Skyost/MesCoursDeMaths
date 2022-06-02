export default {
  site: {
    title: 'Mes cours de maths',
    tagline: 'Les cours de mathématiques de M. Delaunay, disponibles en ligne.',
    description: 'Petit site web où je mets tous mes cours à disposition ainsi que les ressources qui y sont liés.',
    author: 'Hugo Delaunay',
    url: process.env.SITE_URL || 'http://localhost:3000',
    apiUrl: process.env.SITE_API_URL || 'http://localhost:3000/api'
  },
  github: {
    username: 'Skyost',
    repository: 'MesCoursDeMaths',
    dataRepository: 'Cours-HD',
    authentication: {
      clientId: '9b549b66b9ffee93fa55',
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      accessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      cookieExpirationDays: process.env.DEBUG_MODE ? 365 : 1
    },
    lessonsDirectory: 'latex/',
    calendarFile: 'calendar.json',
    downloadDirectory: process.env.GITHUB_DOWNLOAD_DIRECTORY || '.'
  },
  encryptionKey: process.env.ENCRYPTION_KEY,
  debug: process.env.DEBUG_MODE || false,
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
