<script setup lang="ts">
import { siteMeta } from '~/site/meta'

const year = (new Date()).getFullYear()
</script>

<template>
  <footer class="page-footer">
    <b-container class="pb-md-5">
      <b-row>
        <b-col
          cols="12"
          md="8"
          lg="6"
        >
          <p class="mb-0">
            Copyright &copy; {{ year }} — <strong v-text="siteMeta.author" />. Tous droits réservés.
            Voir les <nuxt-link to="/#licence">licences</nuxt-link>.
            <br>Accéder à l'<nuxt-link to="/prof/">espace enseignant</nuxt-link>.
          </p>
        </b-col>
        <b-col
          cols="12"
          md="4"
          lg="6"
          class="mt-3 mt-md-0 text-md-end"
        >
          <ul class="logos flex-md-row-reverse">
            <li>
              <a href="https://www.latex-project.org/">
                <img
                  src="/images/technologies/latex.svg"
                  alt="LaTeX"
                  title="LaTeX"
                >
              </a>
            </li>
            <li>
              <a href="https://vuejs.org/">
                <img
                  src="/images/technologies/vue.svg"
                  alt="Vue"
                  title="Vue"
                >
              </a>
            </li>
            <li>
              <a href="https://nuxtjs.org/">
                <img
                  src="/images/technologies/nuxt.svg"
                  alt="Nuxt"
                  title="Nuxt"
                >
              </a>
            </li>
            <li>
              <a href="https://vercel.com">
                <img
                  src="/images/technologies/vercel.svg"
                  alt="Vercel"
                  title="Vercel"
                >
              </a>
            </li>
            <li>
              <a href="https://github.com">
                <img
                  src="/images/technologies/github.svg"
                  alt="Github"
                  title="Github"
                >
              </a>
            </li>
          </ul>
          <current-commit-sha data-repository-link="/prof/cours/" />
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<style lang="scss" scoped>
.page-footer {
  position: relative;
  padding: 1rem 0.5rem;
  font-size: 0.8em;

  a {
    text-decoration: underline;
  }

  .logos {
    display: flex;
    flex-direction: row;
    list-style-type: none;
    padding-left: 0;
    margin-bottom: 0;

    li img {
      height: 1em;
      padding: 0 0.3em;
    }
  }
}
</style>
