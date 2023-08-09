export interface Level {
  id: string
  name: string
  number: number
  color: string
  subtitle: string
  url: string
  image: string
}

export const createLevel = (id: string, name: string, number: number, color: string): Level => {
  return {
    id,
    name,
    number,
    color,
    subtitle: `Cours de ${number}e`,
    url: `/cours/${id}/`,
    image: `/images/levels/${id}.svg`
  }
}
