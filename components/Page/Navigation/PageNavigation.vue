<template>
  <span v-if="navigationLinks.length > 0">
    <span v-for="(navigationLink, index) of navigationLinks" :key="navigationLink.to">
      <nuxt-link :to="navigationLink.to">{{ navigationLink.title }}</nuxt-link><ski-icon v-if="index < navigationLinks.length - 1" icon="chevron-right" />
    </span>
  </span>
</template>

<script>
import { SkiIcon } from 'skimple-components'
import { useNuxtApp } from '#app'
import { ref } from 'vue'

export default {
  name: 'PageNavigation',
  components: { SkiIcon },
  setup () {
    const navigationLinks = ref([])
    const shouldAdd = (data) => {
      for (const navigationLink of navigationLinks.value) {
        if (navigationLink.to === data.to) {
          return false
        }
      }
      return true
    }

    const compareFunction = (a, b) => {
      return a.depth - b.depth
    }

    const { $bus } = useNuxtApp()
    $bus.$on('navigation', (data) => {
      if (shouldAdd(data)) {
        const links = navigationLinks.value
        links.push(data)
        links.sort(compareFunction)
        navigationLinks.value = links
      }
    })

    $bus.$on('clearNavigation', () => {
      navigationLinks.value = []
    })

    return { navigationLinks }
  }
}
</script>
