function getLevelName (level) {
  switch (level) {
    case 'sixieme':
      return 'Sixième'
    case 'cinquieme':
      return 'Cinquième'
    case 'quatrieme':
      return 'Quatrième'
    case 'troisieme':
      return 'Troisième'
  }
  return null
}

function getLevelAsNumber (level) {
  switch (level) {
    case 'sixieme':
      return '6'
    case 'cinquieme':
      return '5'
    case 'quatrieme':
      return '4'
    case 'troisieme':
      return '3'
  }
  return null
}

function getLevelColor (level) {
  switch (level) {
    case 'sixieme':
      return 'red'
    case 'cinquieme':
      return 'blue'
    case 'quatrieme':
      return 'teal'
    case 'troisieme':
      return 'amber'
  }
  return null
}

export default {
  getLevelName,
  getLevelAsNumber,
  getLevelColor
}
