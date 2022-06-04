import fs from 'fs'
import site from '../site'

const logger = require('../utils/logger')

module.exports = function () {
  this.nuxt.hook('generate:before', () => {
    fs.writeFileSync('static/CNAME', new URL(site.site.url).host)
    logger.success('Generated CNAME.')
  })
}
