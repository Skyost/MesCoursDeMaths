<script setup lang="ts">
import html2canvas from 'html2canvas'
import { loadIcon } from '@iconify/vue'

withDefaults(defineProps<{
  title: string
  body: string
  color?: string
}>(), {
  color: 'red'
})

const root = ref<HTMLElement | null>(null)

const route = useRoute()

const setupDocument = async () => {
  const tables = root.value!.querySelectorAll<HTMLElement>('table')
  for (const table of tables) {
    table.classList.add('table', 'table-bordered', 'table-hover')
    const parent = table.parentNode
    const wrapper = document.createElement('div')
    wrapper.classList.add('table-responsive')
    parent!.replaceChild(wrapper, table)
    wrapper.appendChild(table)
  }

  const dotLines = root.value!.querySelectorAll<HTMLElement>('.dots')
  for (const dotLine of dotLines) {
    const katexHtml = dotLine.closest<HTMLElement>('.katex-html')
    const katex = katexHtml?.closest<HTMLElement>('.katex')
    const base = dotLine?.closest<HTMLElement>('.base')
    if (!katex || !katexHtml || !base) {
      continue
    }

    const parentEnclosing = dotLine.parentElement?.closest<HTMLElement>('.enclosing')
    const element = document.createElement('span')
    element.classList.add('dotline')
    if (parentEnclosing && parentEnclosing.style.width) {
      element.style.width = parentEnclosing.style.width
    }

    if (parentEnclosing) {
      parentEnclosing.replaceWith(element)
    }
    else {
      const baseCount = katex.getElementsByTagName('base').length
      const parentText = katex.parentElement?.textContent
      const katexText = katex.textContent
      if (parentText && katexText) {
        const index = parentText.indexOf(katexText)
        if (index !== -1) {
          const after = parentText.substring(index + katexText.length)
          if (after === '.') {
            katex.nextSibling?.remove()
          }
        }
      }
      if (baseCount <= 1) {
        katex.replaceWith(element)
      }
      else {
        base.replaceWith(element)
      }
    }
  }

  const exercises = root.value!.querySelectorAll<HTMLElement>('.bubble-exercice')
  let printIconHtml = ''
  try {
    const printIcon = await loadIcon('bi:printer-fill')
    printIconHtml = `<svg height="${printIcon.height}" width="${printIcon.width}" aria-hidden="true">${printIcon.body}</svg>`
  }
  catch (exception) {
    console.error(exception)
  }
  let scrollCollapse
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i]
    const correction = exercise.nextElementSibling
    if (correction && correction.classList.contains('bubble-correction')) {
      const id = `correction-${i + 1}`
      const expanded = route.hash === `#${id}`
      const details = document.createElement('details')
      details.setAttribute('id', id)
      details.innerHTML = correction.outerHTML
      correction.parentNode?.insertBefore(details, correction)
      correction.remove()
      const summary = document.createElement('summary')
      summary.classList.add('button-exercice', 'button-correction')
      summary.textContent = 'Correction'
      details.insertBefore(summary, details.firstChild)
      if (expanded) {
        details.setAttribute('open', 'true')
        scrollCollapse = details
      }
      summary.addEventListener('click', (event) => {
        if (details.hasAttribute('open')) {
          event.preventDefault()
          details.classList.add('closing')
        }
      })
      details.addEventListener('animationend', (event) => {
        if (event.animationName === 'close') {
          details.removeAttribute('open')
          details.classList.remove('closing')
        }
      })
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
    print.innerHTML = `${printIconHtml} Imprimer`
    exercise.parentNode?.insertBefore(print, exercise.nextSibling)
    exercise.style.marginBottom = 'calc(1.6em + 1.5rem)'
  }
  if (scrollCollapse) {
    scrollCollapse.scrollIntoView(true)
  }
}

onMounted(setupDocument)
</script>

<template>
  <div
    ref="root"
    class="math-document"
    :class="color"
  >
    <h1 v-html="title" />
    <div
      class="math-document-content"
      v-html="body"
    />
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
  padding: calc(20px + 0.6em + 4px) 20px calc(20px - 1rem);
  margin-bottom: 1.5rem;
  transition: background-color 200ms;

  h4 {
    color: $titleColor;
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
    left: -5px;
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

    h2 {
      color: #1c567d;
      padding-bottom: 0.2em;
      margin-bottom: 0.75em;
      counter-increment: headline-2;
      counter-set: headline-3 0;

      &::before {
        content: counter(headline-2, upper-roman) ' - ';
      }
    }

    h3 {
      color: #2980b9;
      border-bottom: 1px solid #d7d7d7;
      margin-bottom: 0.75em;
      counter-increment: headline-3;

      &::before {
        content: counter(headline-3) '. ';
      }
    }

    h4 {
      border-bottom: none !important;
      margin-bottom: 0 !important;
    }

    img {
      max-width: 100%;
    }

    .table {
      background-color: white;

      td {
        height: 2.5em;
      }
    }

    .button-exercice {
      font-size: 0.8em;
      margin-top: calc(-1.6em - 1.5rem);
      cursor: pointer;

      &.button-correction {
        float: left;
      }

      &.button-print {
        float: right;
      }
    }

    .dotline {
      display: inline-block;
      min-height: 1.5em;
      width: 100%;
      margin-right: 0.25rem;
      border-bottom: 1.5px dotted var(--bs-body-color);
    }

    .framed {
      border: 1px solid black;
      margin-bottom: 1rem;

      p,
      img {
        margin-bottom: 0 !important;
      }
    }

    ol, ul {
      padding-left: 1.5rem;
      margin-bottom: 1rem;

      li {
        padding-left: 1rem;

        &::marker {
          font-weight: bold;
        }

        > *:only-child {
          margin-bottom: 0;
        }
      }
    }

    ol > li > ol {
      list-style-type: lower-alpha;
    }

    ul li {
      list-style-type: '— ';
    }

    details[id^='correction'] {
      &[open] > *:not(summary) {
        animation: open 0.5s;
      }

      &.closing > *:not(summary) {
        animation: close 0.25s !important;
      }

      @keyframes open {
        0% { opacity: 0 }
        100% { opacity: 1 }
      }

      @keyframes close {
        0% { opacity: 1 }
        100% { opacity: 0 }
      }
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

  &.pink h1::after {
    background-color: $pink;
  }

  &.indigo h1::after {
    background-color: $indigo;
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
