import { createLevel, Level } from '~/types'

export const levels: {[key:string]:Level} = {
  sixieme: createLevel('sixieme', 'Sixième', 6, 'red'),
  cinquieme: createLevel('cinquieme', 'Cinquième', 5, 'blue'),
  quatrieme: createLevel('quatrieme', 'Quatrième', 4, 'teal'),
  troisieme: createLevel('troisieme', 'Troisième', 3, 'amber')
}
