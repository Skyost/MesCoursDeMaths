<template>
  <div>
    <page-head title="Accueil" />
    <home-navigation-entry />
    <h1>Bienvenue !</h1>
    <p>
      Bonjour et bienvenue sur ce site où je mettrai en ligne tous mes cours ainsi que les ressources qui y sont rattachées.
      Tout cela est accessible dans la <nuxt-link to="/cours/">liste des cours</nuxt-link>, donc allez y jeter un œil !
    </p>
    <h2>Liens utiles</h2>
    <p>
      Voici quelques sites et pages dont je recommande la visite.
    </p>
    <ul>
      <li>
        <a href="https://www.monclasseurdemaths.fr/">Mon classeur de maths</a>, qui contient tout un tas de cours
        et de vidéos explicatives.
      </li>
      <li>
        La <a href="https://www.youtube.com/channel/UCaDqmzanCq4ZYhdEm0Df9Qg">chaîne YouTube d'Yvan Monka</a>. Bien que
        certaines vidéos soient un peu vieilles, elles restent un bon moyen pour comprendre des notions.
      </li>
      <li>
        Le <a href="https://www.desmaths.fr/cours/">cahier de cours numérique</a> de Desmaths.fr, qui contient également
        pas mal de cours intégralement consultables en ligne.
      </li>
    </ul>
    <h2>Licence</h2>
    <p class="mb-0">
      Les contenus présents sur ce site sont disponibles sous licence
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr">CC BY-NC-SA 4.0</a>.
      Le site a été créé à l'aide de Github Pages et de Vercel. Il est
      <a :href="githubUrl">totalement open-source</a>.
    </p>
  </div>
</template>

<script>
import HomeNavigationEntry from '~/components/Page/Navigation/Entries/HomeNavigationEntry'
import siteMeta from '~/site/meta'
import PageHead from '~/components/Page/PageHead'

export default {
  components: { HomeNavigationEntry, PageHead },
  computed: {
    githubUrl () {
      return `https://github.com/${siteMeta.github.username}/${siteMeta.github.repository}`
    }
  }
}
</script>
