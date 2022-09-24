<template>
  <div>
    <page-head title="Accueil" />
    <home-navigation-entry />
    <section>
      <h1 class="centered">Bienvenue !</h1>
      <ski-columns>
        <ski-column
          class="d-flex align-items-center"
          xs="12"
          lg="10"
        >
          <div class="text-center text-md-start">
            <p>
              Bonjour et bienvenue sur <em>{{ title }}</em>. Je mets sur ce petit site web tous mes cours ainsi que les
              ressources qui y sont rattachées. Vous trouverez donc ici des cours de mathématiques, mais également des
              exercices et des activités de découverte.
            </p>
            <p class="mb-0">
              Tout cela vous est accessible dès maintenant via la <nuxt-link to="/cours/">liste des cours</nuxt-link>,
              donc allez y jeter un œil ! De plus, sachez que ce site web est totalement open-source,
              et ses contenus peuvent tout à fait être réutilisés.
              Pour plus d'informations, rendez-vous <a href="#licence">ci-dessous</a> !
            </p>
          </div>
        </ski-column>
        <ski-column
          class="d-flex align-items-center justify-content-center"
          xs="12"
          lg="2"
        >
          <img class="column-image welcome-image" src="/images/index/welcome.svg" alt="Bienvenue">
        </ski-column>
      </ski-columns>
    </section>
    <hr>
    <section>
      <h2 class="centered">Liens utiles</h2>
      <div class="text-center">
        <p>
          Voici quelques sites et pages dont je recommande la visite.
        </p>
      </div>
      <ski-columns class="justify-content-center">
        <ski-column
          v-for="link in links"
          :key="link.id"
          xs="12"
          md="6"
          lg="4"
          class="mt-3"
        >
          <image-card
            :to="link.to"
            :subtitle="link.name"
            :image="link.image"
          >
            {{ link.text }}
          </image-card>
        </ski-column>
      </ski-columns>
    </section>
    <hr>
    <h2 id="licence" class="centered">Licence</h2>
    <ski-columns>
      <ski-column
        class="d-none d-md-flex align-items-center"
        xs="12"
        md="2"
      >
        <img class="column-image" src="/images/index/license.svg" alt="Licence">
      </ski-column>
      <ski-column
        class="d-flex align-items-center"
        xs="12"
        md="10"
      >
        <div class="text-center text-md-start">
          <p>
            Les contenus présents sur ce site sont disponibles sous licence
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr">CC BY-NC-SA 4.0</a>.
            Le site a été créé à l'aide de Github Pages et de Vercel. Il est
            <a :href="githubUrl">totalement open-source</a>.
          </p>
          <p class="mb-0">
            Quelques contenus sont tirés des manuels
            <a href="https://www.enseignants.hachette-education.com/collections/mission-indigo-mathematiques">Mission indigo</a>,
            que je trouve de grande qualité. Les illustrations du site et des cours proviennent de
            <a href="https://www.freepik.com">FreePik</a> et de <a href="https://www.flaticon.com/">FlatIcon</a>.
          </p>
        </div>
      </ski-column>
    </ski-columns>
  </div>
</template>

<script>
import HomeNavigationEntry from '~/components/Page/Navigation/Entries/HomeNavigationEntry'
import siteMeta from '~/site/meta'
import PageHead from '~/components/Page/PageHead'

export default {
  components: { HomeNavigationEntry, PageHead },
  data () {
    return {
      links: [
        {
          id: 'monclasseurdemaths',
          to: 'https://www.monclasseurdemaths.fr/',
          name: 'Mon classeur de maths',
          image: '/images/index/monclasseurdemaths.png',
          text: 'Ce petit site contient tout un tas de cours et de vidéos explicatives.'
        },
        {
          id: 'desmaths',
          to: 'https://www.desmaths.fr/cours/',
          name: 'Desmaths.fr',
          image: '/images/index/desmaths.svg',
          text: 'Contient également pas mal de cours intégralement consultables en ligne.'
        },
        {
          id: 'yvan-monka',
          to: 'https://www.youtube.com/c/YMONKA',
          name: 'Yvan Monka sur YouTube',
          image: '/images/index/yvan-monka.png',
          text: 'Bien que certaines de ses vidéos soient un peu vieilles, elles restent un bon moyen pour comprendre des notions.'
        },
        {
          id: 'el-jj',
          to: 'https://www.youtube.com/c/ElJj42',
          name: 'El Jj sur YouTube',
          image: '/images/index/el-jj.png',
          text: 'Une véritable mine d\'or de culture mathématique que je ne peux que recommander.'
        },
        {
          id: 'micmaths',
          to: 'https://www.youtube.com/c/Micmaths',
          name: 'Micmaths sur YouTube',
          image: '/images/index/micmaths.png',
          text: 'Une autre chaîne de vulgarisation mathématique, approuvée par McFly et Carlito !'
        }
      ]
    }
  },
  computed: {
    githubUrl () {
      return `https://github.com/${siteMeta.github.username}/${siteMeta.github.repository}`
    },
    title () {
      return siteMeta.title
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/bootstrap-mixins';

.column-image {
  width: 100%;
  max-width: 400px;

  &.welcome-image {
    margin-top: 0;

    @include media-breakpoint-down(lg) {
      margin-top: 50px;
      max-width: 150px;
    }

    @include media-breakpoint-down(md) {
      max-width: 100px;
    }
  }
}
</style>
