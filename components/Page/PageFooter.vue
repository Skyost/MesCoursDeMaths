<template>
  <footer class="page-footer bg-dark">
    <ski-container class="pt-4 pb-4">
      <ski-columns>
        <ski-column>
          <p class="mb-0">
            Copyright &copy; 2022 — <strong v-text="author" />. Tous droits réservés.
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
import { SkiContainer, SkiColumns, SkiColumn } from 'skimple-components'
import site from '~/site'

export default {
  name: 'PageFooter',
  components: { SkiContainer, SkiColumns, SkiColumn },
  computed: {
    author () {
      return site.site.author
    }
  }
}
</script>

<style lang="scss" scoped>
.page-footer {
  padding: 0.5rem 1rem;
  color: rgba(white, 0.5);

  h2 {
    font-size: 1.5em;
    color: rgba(white, 0.75);
    border-bottom: 1px solid rgba(white, 0.75);
    padding-bottom: 0.15em;
    margin-bottom: 0.5em;
  }

  strong,
  a {
    color: rgba(white, 0.75);
  }

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
