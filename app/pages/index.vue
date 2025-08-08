<script lang="ts">
export const homeNavigationEntry = {
  title: 'Page d\'accueil',
  to: '/',
  depth: 0
}
</script>

<script setup lang="ts">
import siteMeta from '~/site/meta'
import { usePageHead } from '~/composables/usePageHead'

const githubUrl = `https://github.com/${siteMeta.github.username}/${siteMeta.github.repository}`
const links = [
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
  },
  {
    id: 'voyage-au-pays-des-maths',
    to: 'https://www.youtube.com/playlist?list=PLCwXWOyIR22veT31gK5JwmqxuVc0Uoy8a',
    name: 'Voyage au pays des maths',
    image: '/images/index/voyage-au-pays-des-maths.png',
    text: 'Une série de vidéos YouTube très accessible produite par ARTE sur divers thèmes mathématiques.'
  }
]

useNavigationEntry(homeNavigationEntry)
usePageHead({ title: 'Accueil' })
</script>

<template>
  <div>
    <section>
      <h1 class="centered">
        Bienvenue !
      </h1>
      <b-row>
        <b-col
          class="d-flex align-items-center"
          xs="12"
          lg="10"
        >
          <div class="text-center text-md-start">
            <p>
              Bonjour et bienvenue sur <em>{{ siteMeta.title }}</em>. Je suis Hugo Delaunay, professeur agrégé de mathématiques, et
              je mets sur ce petit site web tous mes cours ainsi que les ressources qui y sont rattachées.
              Vous trouverez donc ici des cours de mathématiques, mais également des exercices corrigés, des activités de découverte,
              des devoirs, etc.
            </p>
            <p>
              Tout cela vous est accessible dès maintenant via la <nuxt-link to="/cours/">liste des cours</nuxt-link>,
              donc allez y jeter un œil ! De plus, sachez que ce site web est totalement open-source,
              et ses contenus peuvent tout à fait être réutilisés.
              Pour plus d'informations, rendez-vous <a href="#licence">ci-dessous</a> !
            </p>
            <p class="mb-0">
              Si vous souhaitez plus d'informations sur moi ou si vous souhaitez me contacter, vous pouvez le
              faire sur la <nuxt-link to="/a-propos/">page dédiée</nuxt-link>.
            </p>
          </div>
        </b-col>
        <b-col
          class="d-flex align-items-center justify-content-center"
          xs="12"
          lg="2"
        >
          <img
            class="column-image welcome-image"
            src="/images/index/welcome.svg"
            alt="Bienvenue"
          >
        </b-col>
      </b-row>
    </section>
    <hr>
    <section>
      <h2 class="centered">
        Liens utiles
      </h2>
      <div class="text-center">
        <p>
          Voici quelques sites et pages dont je recommande la visite.
        </p>
      </div>
      <b-row class="justify-content-center">
        <b-col
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
            <p
              class="mt-1 mb-0"
              v-text="link.text"
            />
          </image-card>
        </b-col>
      </b-row>
    </section>
    <hr>
    <h2
      id="licence"
      class="centered"
    >
      Licence
    </h2>
    <b-row>
      <b-col
        class="d-none d-md-flex align-items-center"
        xs="12"
        md="2"
      >
        <img
          class="column-image"
          src="/images/index/license.svg"
          alt="Licence"
        >
      </b-col>
      <b-col
        class="d-flex align-items-center"
        xs="12"
        md="10"
      >
        <div class="text-center text-md-start">
          <p>
            Les contenus présents sur ce site sont disponibles sous licence
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr">CC BY-NC-SA 4.0</a>.
            Il a été créé à l'aide de Github Pages et de Nuxt. Il est
            <a :href="githubUrl">totalement open-source</a>.
          </p>
          <p class="mb-0">
            Quelques contenus de niveau collège sont tirés des manuels
            <a href="https://www.enseignants.hachette-education.com/collections/mission-indigo-mathematiques">Mission Indigo</a>,
            que je trouve de grande qualité. Des contenus de niveau lycée sont tirés des manuels
            <a href="https://manuel.sesamath.net/">Sésamath</a>, dont le statut libre est à souligner (et à soutenir).
            Les illustrations du site et des cours proviennent de
            <a href="https://www.freepik.com">FreePik</a> et de <a href="https://www.flaticon.com/">FlatIcon</a>.
          </p>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/bootstrap-mixins';

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
