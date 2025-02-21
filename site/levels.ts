import type { Level } from '~/types'

/**
 * Object containing levels.
 */
export const levels: { [key: string]: Level } = {
  'sixieme': {
    id: 'sixieme',
    name: 'Sixième',
    short: '6e',
    color: 'red',
    otherResources: [
      {
        name: 'Agenda',
        description: 'Fiche d\'AP sur l\'utilisation de l\'agenda.',
        url: '/pdf/sixieme/ap-agenda.pdf'
      },
      {
        name: 'Carrés magiques',
        description: 'Fiche d\'AP permettant de travailler le calcul mental à travers des carrés magiques.',
        url: '/pdf/sixieme/ap-carres-magiques.pdf'
      },
      {
        name: 'Les dents vertes',
        description: 'Fiche d\'AP permettant de travailler la logique mathématique.',
        url: '/pdf/sixieme/ap-dents-vertes.pdf'
      },
      {
        name: 'Sudoku',
        description: 'Fiche d\'AP contenant une grille de sudoku "bilan" sur l\'année.',
        url: '/pdf/sixieme/ap-sudoku.pdf'
      },
      {
        name: 'Kendoku',
        description: 'Fiche d\'AP permettant de travailler le calcul mental à travers le remplissage de grilles de kendoku.',
        url: '/pdf/sixieme/ap-kendoku.pdf'
      },
      {
        name: 'ChatGPT',
        description: 'Fiche d\'AP pour prévenir l\'utilisation de l\'intelligence artificielle dans le cadre des devoirs.',
        url: '/pdf/sixieme/ap-chatgpt.pdf'
      },
      {
        name: 'Cryptographie',
        description: 'Une fiche sur la cryptographie contenant quelques exemples de chiffrements. Créée dans le but de préparer le visionnage du film Imitation Game.',
        url: '/pdf/sixieme/cryptographie.pdf'
      },
      {
        name: 'ERROR 1980',
        description: 'Un escape game sur le thème du retour dans le passé, accessible en ligne contenant diverses énigmes mathématiques à résoudre.',
        url: 'https://skyost.github.io/Error1980/'
      },
      {
        name: 'Voyage à Cendlard',
        description: 'Un escape game sur le thème de la magie, accessible en ligne contenant diverses énigmes mathématiques à résoudre.',
        url: 'https://skyost.github.io/VoyageACendlard/'
      },
      {
        name: 'Murder Mystery',
        description: 'Un escape game sur thème policier, accessible en ligne contenant diverses énigmes mathématiques à résoudre.',
        url: 'https://skyost.github.io/MurderMystery/'
      },
      {
        name: 'Travail de groupe 1',
        description: 'Un travail de groupe sur la géométrie et les programmes de construction.',
        url: '/pdf/sixieme/groupes-1.pdf'
      },
      {
        name: 'Travail de groupe 2',
        description: 'Un travail de groupe sur la divisibilité et la notion de conjecture.',
        url: '/pdf/sixieme/groupes-2.pdf'
      },
      {
        name: 'Travail de groupe 3',
        description: 'Un travail de groupe sur la distinction aire / périmètre.',
        url: '/pdf/sixieme/groupes-3.pdf'
      },
      {
        name: 'Travail de groupe 4',
        description: 'Un travail de groupe sur la proportionnalité (puzzle de Brousseau).',
        url: '/pdf/sixieme/groupes-4.pdf'
      },
      {
        name: 'Questions flash',
        description: 'Questions flash sur les différents chapitres. La plupart proviennent de Mission Indigo.',
        url: '/pdf/sixieme/questions-flash.pdf'
      }
    ]
  },
  'cinquieme': {
    id: 'cinquieme',
    name: 'Cinquième',
    short: '5e',
    color: 'blue',
    otherResources: [
      {
        name: 'Kendoku',
        description: 'Fiche d\'AP permettant de travailler le calcul mental à travers le remplissage de grilles de kendoku.',
        url: '/pdf/cinquieme/ap-kendoku.pdf'
      },
      {
        name: 'Braille',
        description: 'Fiche d\'AP permettant de travailler le placement des nombres relatifs sur droite graduée.',
        url: '/pdf/cinquieme/ap-braille.pdf'
      },
      {
        name: 'Les dents vertes',
        description: 'Fiche d\'AP permettant de travailler la logique mathématique.',
        url: '/pdf/cinquieme/ap-dents-vertes.pdf'
      },
      {
        name: 'ERROR 1980',
        description: 'Un escape game sur le thème du retour dans le passé, accessible en ligne contenant diverses énigmes mathématiques à résoudre.',
        url: 'https://skyost.github.io/Error1980/'
      },
      {
        name: 'Voyage à Cendlard',
        description: 'Un escape game sur le thème de la magie, accessible en ligne contenant diverses énigmes mathématiques à résoudre.',
        url: 'https://skyost.github.io/VoyageACendlard/'
      },
      {
        name: 'Murder Mystery',
        description: 'Un escape game sur thème policier, accessible en ligne contenant diverses énigmes mathématiques à résoudre.',
        url: 'https://skyost.github.io/MurderMystery/'
      },
      {
        name: 'Travail de groupe 1',
        description: 'Un travail de groupe sur la proportionnalité (puzzle de Brousseau).',
        url: '/pdf/cinquieme/groupes-1.pdf'
      },
      {
        name: 'Travail de groupe 2',
        description: 'Un travail de groupe sur les enchaînements d\'opérations.',
        url: '/pdf/cinquieme/groupes-2.pdf'
      },
      {
        name: 'Travail de groupe 3',
        description: 'Un travail de groupe sur le placement de nombres relatifs dans un repère et sur la médiatrice.',
        url: '/pdf/cinquieme/groupes-3.pdf'
      },
      {
        name: 'Travail de groupe 4',
        description: 'Un travail de groupe sur les opérations sur les nombres relatifs.',
        url: '/pdf/cinquieme/groupes-4.pdf'
      },
      {
        name: 'Travail de groupe 5',
        description: 'Un travail de groupe sur les fractions.',
        url: '/pdf/cinquieme/groupes-5.pdf'
      },
      {
        name: 'Travail de groupe 6',
        description: 'Un travail de groupe sur les probabilités à travers le problème de Monty Hall.',
        url: '/pdf/cinquieme/groupes-6.pdf'
      },
      {
        name: 'Questions flash',
        description: 'Questions flash sur les différents chapitres. La plupart proviennent de Mission Indigo.',
        url: '/pdf/cinquieme/questions-flash.pdf'
      }
    ]
  },
  'troisieme': {
    id: 'troisieme',
    name: 'Troisième',
    short: '3e',
    color: 'amber',
    otherResources: [
      {
        name: 'Sudoku',
        description: 'Fiche d\'AP permettant de travailler les fractions à travers le remplissage d\'une grille de sudoku.',
        url: '/pdf/troisieme/ap-sudoku.pdf'
      },
      {
        name: 'Fiche méthode sur les angles',
        description: 'Fiche méthode pour travailler sur les angles.',
        url: '/pdf/troisieme/fiche-methode-angles.pdf'
      },
      {
        name: 'Fiche méthode sur le calcul littéral',
        description: 'Fiche méthode pour travailler sur le calcul littéral.',
        url: '/pdf/troisieme/fiche-methode-calcul-litteral.pdf'
      },
      {
        name: 'Fiche méthode sur le calcul numérique',
        description: 'Fiche méthode pour travailler sur le calcul numérique.',
        url: '/pdf/troisieme/fiche-methode-calcul-numerique.pdf'
      },
      {
        name: 'Fiche méthode sur les équations',
        description: 'Fiche méthode pour travailler sur les équations.',
        url: '/pdf/troisieme/fiche-methode-equations.pdf'
      },
      {
        name: 'Fiche méthode sur le théorème de Pythagore',
        description: 'Fiche méthode pour travailler sur le théorème de Pythagore et sa réciproque.',
        url: '/pdf/troisieme/fiche-methode-pythagore.pdf'
      },
      {
        name: 'Fiche méthode sur le théorème de Thalès',
        description: 'Fiche méthode pour travailler sur le théorème de Thalès et sa réciproque.',
        url: '/pdf/troisieme/fiche-methode-thales.pdf'
      },
      {
        name: 'Questions flash',
        description: 'Questions flash sur les différents chapitres. La plupart proviennent de Mission Indigo.',
        url: '/pdf/troisieme/questions-flash.pdf'
      }
    ]
  },
  'seconde': {
    id: 'seconde',
    name: 'Seconde',
    short: '2nde',
    color: 'indigo',
    otherResources: [
      {
        name: 'Algorithmique et programmation',
        description: 'Fiche récapitulant les notions de Python vues au cours de l\'année.',
        url: '/pdf/seconde/algorithmique-programmation.pdf'
      },
      {
        name: 'Fiche d\'utilisation de la NumWorks',
        description: 'Fiche sur l\'utilisation de la calculatrice NumWorks.',
        url: '/pdf/seconde/calculatrice-numworks.pdf'
      },
      {
        name: 'Fiche d\'utilisation de la Casio Graph 35+E II',
        description: 'Fiche sur l\'utilisation de la calculatrice Casio Graph 35+E II.',
        url: '/pdf/seconde/calculatrice-casio.pdf'
      },
      {
        name: 'Fiche d\'utilisation de la TI-83 Premium CE',
        description: 'Fiche sur l\'utilisation de la calculatrice TI-83 Premium CE.',
        url: '/pdf/seconde/calculatrice-ti.pdf'
      },
      {
        name: 'Automatismes de Troisième',
        description: 'Fiche d\'AP permettant de retravailler les notions vues en Troisième.',
        url: '/pdf/seconde/ap-automatismes.pdf'
      },
      {
        name: 'Utilisation de la calculatrice',
        description: 'Fiche d\'AP contenant des exercices à faire avec la calculatrice.',
        url: '/pdf/seconde/ap-calculatrice.pdf'
      },
      {
        name: 'Les dents vertes',
        description: 'Fiche d\'AP permettant de travailler la logique mathématique.',
        url: '/pdf/seconde/ap-dents-vertes.pdf'
      },
      {
        name: 'Logique et symboles',
        description: 'Fiche d\'AP sur le vocabulaire et les symboles utilisés en logique mathématique.',
        url: '/pdf/seconde/ap-logique-symboles.pdf'
      },
      {
        name: 'Raisonnement par l\'absurde',
        description: 'Fiche d\'AP sur le raisonnement par l\'absurde.',
        url: '/pdf/seconde/ap-raisonnement-absurde.pdf'
      },
      {
        name: 'Crack the code !',
        description: 'Fiche d\'AP sur permettant de travailler la logique à travers la résolution d\'énigmes.',
        url: '/pdf/seconde/ap-cadenas.pdf'
      },
      {
        name: 'Devoir surveillé 1',
        description: 'Devoir surveillé sur Calcul littéral et équations et Vecteurs du plan.',
        url: '/pdf/seconde/devoir-1.pdf'
      },
      {
        name: 'Devoir surveillé 2',
        description: 'Devoir surveillé sur Calcul numérique et Ensembles de nombres.',
        url: '/pdf/seconde/devoir-2.pdf'
      }
    ]
  },
  'premiere-stmg': {
    id: 'premiere-stmg',
    name: 'Première STMG',
    short: '1ère STMG',
    color: 'pink',
    otherResources: [
      {
        name: 'Fiche méthode sur les inéquations',
        description: 'Fiche méthode pour travailler sur les inéquations.',
        url: '/pdf/premiere-stmg/fiche-methode-inequations.pdf'
      },
      {
        name: 'Devoir surveillé 1',
        description: 'Devoir surveillé sur Proportions et évolutions, Notion de fonction et Suites numériques.',
        url: '/pdf/premiere-stmg/devoir-1.pdf'
      },
      {
        name: 'Devoir surveillé 2',
        description: 'Devoir surveillé sur Croisement de deux variables, Fonctions affines et Fonctions polynômiales du second degré.',
        url: '/pdf/premiere-stmg/devoir-2.pdf'
      },
      {
        name: 'Devoir surveillé 3',
        description: 'Devoir surveillé sur Géométrie repérée, Notion de fonction et Poportions et évolutions.',
        url: '/pdf/premiere-stmg/devoir-3.pdf'
      }
    ]
  }
}

/**
 * Returns the subtitle for a given level.
 * @param level The level.
 * @returns The level subtitle.
 */
export const getLevelSubtitle = (level: Level): string => `Cours de ${level.short}`

/**
 * Returns the URL for a given level.
 * @param level The level.
 * @returns The level URL.
 */
export const getLevelUrl = (level: Level): string => `/cours/${level.id}/`

/**
 * Returns the image URL for a given level.
 * @param level The level.
 * @returns The level image URL.
 */
export const getLevelImage = (level: Level): string => `/images/${level.id}/image.svg`
