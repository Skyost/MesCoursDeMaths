<script setup lang="ts">
import html2canvas from 'html2canvas'
import { LessonContent } from '~/types'

withDefaults(defineProps<{
  document: LessonContent,
  color?: string
}>(), {
  color: 'red'
})

const root = ref<HTMLElement | null>(null)
const setupTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const initialDotsTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const route = useRoute()

const setupDocument = () => {
  const dotLines = root.value!.querySelectorAll<HTMLElement>('.dots')
  for (const dotLine of dotLines) {
    const parent = dotLine.parentElement
    const base = parent?.closest<HTMLElement>('.base')
    if (base) {
      base.style.width = 'initial'
    }
    const enclosing = parent?.closest<HTMLElement>('.enclosing')
    if (enclosing) {
      enclosing.style.display = 'inline-block'
      enclosing.style.textAlign = 'center'
    }
  }

  const exercises = root.value!.querySelectorAll<HTMLElement>('.bubble-exercice')
  let scrollCollapse
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i]
    if (exercise.nextElementSibling && exercise.nextElementSibling.classList.contains('bubble-correction')) {
      exercise.nextElementSibling.id = `correction-${i + 1}`
      exercise.nextElementSibling.classList.add('collapse')
      const correction = document.createElement('span')
      correction.classList.add('button-exercice')
      correction.classList.add('button-correction')
      correction.setAttribute('data-bs-toggle', 'collapse')
      correction.setAttribute('data-bs-target', `#correction-${i + 1}`)
      correction.innerHTML = '<i class="bi bi-chevron-down"></i> <span class="show">Voir</span><span class="hide">Cacher</span> la correction'
      if (route.hash === `#correction-${i + 1}`) {
        scrollCollapse = exercise.nextElementSibling
        scrollCollapse.classList.add('show')
      } else {
        correction.classList.add('collapsed')
      }
      exercise.parentNode?.insertBefore(correction, exercise.nextSibling)
    }

    const print = document.createElement('span')
    print.classList.add('button-exercice')
    print.classList.add('button-print')
    print.onclick = async () => {
      const canvas = await html2canvas(exercise)
      const newWindow = window.open()
      if (newWindow) {
        const img = newWindow.document.createElement('img')
        img.src = canvas.toDataURL()
        img.style.maxWidth = '100%'
        newWindow.document.body.appendChild(img)
        setTimeout(() => {
          newWindow.print()
          newWindow.close()
        }, 100)
      }
    }
    print.innerHTML = '<i class="bi bi-printer-fill"></i> Imprimer'
    exercise.parentNode?.insertBefore(print, exercise.nextSibling)
    exercise.style.marginBottom = 'calc(1.6em + 1.5rem)'
  }
  if (scrollCollapse) {
    scrollCollapse.scrollIntoView(true)
  }

  setupTimeout.value = null
}

const resizeDotLines = () => {
  const dotLines = root.value!.querySelectorAll<HTMLElement>('.dots')
  for (const dotLine of dotLines) {
    dotLine.innerHTML = '. . . '
    if (dotLine.parentElement) {
      const originalHeight = dotLine.parentElement.offsetHeight
      while (dotLine.parentElement.offsetHeight === originalHeight) {
        if (!dotLine.parentElement.offsetWidth || dotLine.parentElement.offsetWidth <= 0) {
          break
        }
        dotLine.innerHTML += '. '
      }
      dotLine.innerHTML = dotLine.innerHTML.substring(0, Math.max(0, dotLine.innerHTML.length - 2))
    }
  }
  initialDotsTimeout.value = null
}

onMounted(async () => {
  await nextTick()
  setupTimeout.value = setTimeout(setupDocument, 1000)
  initialDotsTimeout.value = setTimeout(resizeDotLines, 1000)
  window.addEventListener('load', resizeDotLines)
  window.addEventListener('resize', resizeDotLines)
})

onUnmounted(() => {
  if (setupTimeout.value) {
    clearTimeout(setupTimeout.value)
    setupTimeout.value = null
  }
  if (initialDotsTimeout.value) {
    clearTimeout(initialDotsTimeout.value)
    initialDotsTimeout.value = null
  }
  window.removeEventListener('load', resizeDotLines)
  window.removeEventListener('resize', resizeDotLines)
})
</script>

<template>
  <div ref="root" class="math-document" :class="color">
    <h1 v-html="document.name" />
    <content-renderer class="math-document-content" :value="document" />
  </div>
</template>

<style lang="scss">
@import '../assets/colors';

@mixin bubble-style($text, $backgroundColor, $titleColor) {
  position: relative;
  width: 100%;
  background-color: $backgroundColor;
  border: 0 solid $titleColor;
  border-left-width: 6px;
  padding: calc(20px + 0.6em + 4px) 20px calc(20px - 1rem) 20px;
  margin-bottom: 1.5rem;
  transition: background-color 200ms;

  h4 {
    color: $titleColor;
  }

  img {
    margin-bottom: 1rem;
  }

  ul li::marker,
  ol li::marker {
    color: $titleColor;
  }

  &:hover {
    background-color: darken($backgroundColor, 2%);
  }

  &::before {
    content: $text;
    position: absolute;
    top: 0;
    left: -6px;
    background-color: $titleColor;
    color: white;
    font-size: 0.6em;
    text-transform: uppercase;
    padding: 2px 8px;
  }
}

.math-document {
  counter-reset: headline-2 headline-3 exercice;

  h1::after {
    display: block;
    content: '';
    width: 60px;
    height: 5px;
    margin: 10px 0 15px;
  }

  .math-document-content {
    .doctitle,
    .docnumber {
      display: none;
    }

    .button-exercice {
      font-size: 0.8em;
      margin-top: calc(-1.6em - 1.5rem);
      cursor: pointer;

      &.button-correction {
        float: left;

        .bi-chevron-down::before {
          transition: transform 200ms;
        }

        .show {
          display: none;
        }

        .hide {
          display: inline;
        }

        &.collapsed {
          .show {
            display: inline;
          }

          .hide {
            display: none;
          }

          .bi-chevron-down::before {
            transform: rotate(-90deg);
          }
        }
      }

      &.button-print {
        float: right;
      }
    }

    .dots {
      white-space: normal;
    }

    .framed {
      border: 1px solid black;
      margin-bottom: 1rem;

      p,
      img {
        margin-bottom: 0 !important;
      }
    }

    ol,
    ul {
      margin-bottom: 1rem;
    }

    .center {
      text-align: center;
    }

    .flex-grow {
      flex-grow: 1;
    }

    .col {
      --column-size: 0.5;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      flex-grow: var(--column-size);
      flex-shrink: var(--column-size);

      .text-center {
        align-self: center;
      }

      .text-end {
        align-self: flex-end;
      }

      img {
        max-width: 100%;
      }
    }
  }

  &.red h1::after {
    background-color: $red;
  }

  &.blue h1::after {
    background-color: $blue;
  }

  &.teal h1::after {
    background-color: $teal;
  }

  &.amber h1::after {
    background-color: $yellow;
  }
}

.bubble-objectifs {
  @include bubble-style('👌 Objectifs', #fceae9, #e74c3c);
}

.bubble-retenir {
  @include bubble-style('👀 À retenir', #ebf3fb, #3583d6);
}

.bubble-exemple {
  @include bubble-style('💡 Exemple', #dcf3d8, #26a65b);
}

.bubble-exercice {
  counter-increment: exercice;

  @include bubble-style('📝 Exercice ' counter(exercice), #e0f2f1, #009688);
}

.bubble-information {
  @include bubble-style('☝ Information', #fce4ec, #e91e63);
}

.bubble-correction {
  @include bubble-style('✔ Correction de l\'exercice ' counter(exercice), #e8eaf6, #3f51b5);
}
</style>
