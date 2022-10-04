import consola from 'consola'

function info (prefix, message, options = null) {
  consola.info({
    message: `[${prefix}] ${message}`,
    additional: options ? JSON.stringify(options, null, 2) : null
  })
}

function warn (prefix, message, options = null) {
  consola.warn({
    message: `[${prefix}] ${message}`,
    additional: options ? JSON.stringify(options, null, 2) : null
  })
}

function fatal (prefix, message, options = null) {
  consola.fatal({
    message: `[${prefix}] ${message}`,
    additional: options ? JSON.stringify(options, null, 2) : null
  })
}

function success (prefix, message, options = null) {
  consola.success({
    message: `[${prefix}] ${message}`,
    additional: options ? JSON.stringify(options, null, 2) : null
  })
}

export default { info, warn, fatal, success }
