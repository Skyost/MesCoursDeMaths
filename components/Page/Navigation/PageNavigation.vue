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

    /*
    const route = useRoute()
    watch(route, () => {
      navigationLinks.value = []
    })
    */

    const { $bus } = useNuxtApp()
    $bus.$on('navigation', (data) => {
      if (shouldAdd(data)) {
        navigationLinks.value.push(data)
      }
    })

    $bus.$on('clearNavigation', () => {
      navigationLinks.value = []
    })

    return { navigationLinks }
  }
}
</script>
