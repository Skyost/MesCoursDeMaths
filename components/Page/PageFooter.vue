<template>
  <footer class="page-footer">
    <ski-container class="pb-5">
      <ski-columns>
        <ski-column>
          <p class="mb-0">
            Copyright &copy; 2022 — <strong v-text="author" />. Tous droits réservés.
            Voir les <nuxt-link to="/#licence">licences</nuxt-link>.
            <br>Accéder à l'<nuxt-link to="/prof/">espace enseignant</nuxt-link>.
          </p>
        </ski-column>
        <ski-column>
          <ul class="logos">
            <li>
              <a href="https://www.latex-project.org/">
                <img src="/images/technologies/latex.svg" alt="LaTeX" title="LaTeX">
              </a>
            </li>
            <li>
              <a href="https://vuejs.org/">
                <img src="/images/technologies/vue.svg" alt="Vue" title="Vue">
              </a>
            </li>
            <li>
              <a href="https://nuxtjs.org/">
                <img src="/images/technologies/nuxt.svg" alt="Nuxt" title="Nuxt">
              </a>
            </li>
            <li>
              <a href="https://vercel.com">
                <img src="/images/technologies/vercel.svg" alt="Vercel" title="Vercel">
              </a>
            </li>
            <li>
              <a href="https://github.com">
                <img src="/images/technologies/github.svg" alt="Github" title="Github">
              </a>
            </li>
          </ul>
        </ski-column>
      </ski-columns>
    </ski-container>
  </footer>
</template>

<script>
import { SkiColumn, SkiColumns, SkiContainer } from 'skimple-components'
import siteMeta from '~/site/meta'

export default {
  name: 'PageFooter',
  components: { SkiContainer, SkiColumns, SkiColumn },
  computed: {
    author () {
      return siteMeta.author
    }
  }
}
</script>

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
    flex-direction: row-reverse;
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
