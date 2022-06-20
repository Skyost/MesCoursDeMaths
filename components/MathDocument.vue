<template>
  <div class="math-document" :class="color">
    <h1 v-html="document.name" />
    <nuxt-content class="math-document-content" :document="document" />
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'MathDocument',
  props: {
    document: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: 'red'
    }
  },
  async mounted () {
    await this.$nextTick()
    const exercises = this.$el.getElementsByClassName('bubble-exercice')
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i]
      exercise.style.setProperty('--number', `'${i + 1}'`)
      const print = document.createElement('span')
      print.style.fontSize = '0.8em'
      print.style.float = 'right'
      print.style.marginTop = '-1.6em'
      print.style.cursor = 'pointer'
      print.style.alignSelf = 'end'
      print.onclick = async function () {
        const canvas = await html2canvas(exercise)
        const newWindow = window.open()
        newWindow.document.body.appendChild(canvas)
        newWindow.print()
        newWindow.close()
      }
      print.innerHTML = '<i class="bi bi-printer-fill"></i> Imprimer'
      exercise.parentNode.insertBefore(print, exercise.nextSibling)
    }
    const extractedImages = this.$el.getElementsByClassName('extracted-image')
    for (const extractedImage of extractedImages) {
      extractedImage.onload = function () {
        extractedImage.width = extractedImage.naturalWidth * 1.5
      }
    }
    const tables = this.$el.querySelectorAll('.math-document table')
    for (const table of tables) {
      table.classList.add('table')
      table.classList.add('table-bordered')
      table.classList.add('table-hover')
    }
    const dotLines = this.$el.getElementsByClassName('dots')
    for (const dotLine of dotLines) {
      const parent = dotLine.parentNode
      const base = parent.closest('.base')
      if (base) {
        base.style.width = 'initial'
      }
      const enclosing = parent.closest('.enclosing')
      if (enclosing) {
        enclosing.style.display = 'inline-block'
        enclosing.style.textAlign = 'center'
      }
    }
    setTimeout(this.resizeDotLines, 1000)
    window.addEventListener('load', this.resizeDotLines)
    window.addEventListener('resize', this.resizeDotLines)
  },
  destroyed () {
    window.removeEventListener('load', this.resizeDotLines)
    window.removeEventListener('resize', this.resizeDotLines)
  },
  methods: {
    resizeDotLines () {
      const dotLines = this.$el.getElementsByClassName('dots')
      for (const dotLine of dotLines) {
        dotLine.innerHTML = '. . . '
        const originalHeight = dotLine.parentElement.offsetHeight
        while (dotLine.parentElement.offsetHeight === originalHeight) {
          dotLine.innerHTML += '. '
        }
        dotLine.innerHTML = dotLine.innerHTML.substring(0, dotLine.innerHTML.length - 2)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'katex/dist/katex.min.css';
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';

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
    border-bottom: none;
    margin-bottom: 0;
  }

  img {
    margin-bottom: 1rem;
  }

  &:hover {
    background-color: darken($backgroundColor, 2%);
  }

  &::before {
    content: $text;
    position: absolute;
    top: 0;
    left: 0;
    background-color: $titleColor;
    color: white;
    font-size: 0.6em;
    text-transform: uppercase;
    padding: 2px 8px 2px 2px;
  }
}

.math-document {
  h1::after {
    display: block;
    content: '';
    width: 60px;
    height: 5px;
    margin: 10px 0 15px 0;
  }

  h2 {
    color: #1c567d;
    padding-bottom: 0.2em;
    margin-bottom: 0.75em;
  }

  h3 {
    color: #2980b9;
    border-bottom: 1px solid #d7d7d7;
    margin-bottom: 0.75em;
  }

  .math-document-content {
    .doctitle,
    .docnumber {
      display: none;
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

    ul li {
      list-style-type: '— ';

      &:last-child,
      &:last-child > p {
        margin-bottom: 0;
      }
    }

    ol li::marker {
      font-weight: bold;
    }

    .table {
      background-color: white;

      td {
        height: 2.5em;
      }
    }

    .center {
      text-align: center;
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
      @include bubble-style('📝 Exercice ' var(--number), #e0f2f1, #009688);
    }

    .bubble-information {
      @include bubble-style('☝ Information', #fce4ec, #e91e63);
    }
  }
}

.math-document.red h1::after {
  background-color: $red;
}

.math-document.blue h1::after {
  background-color: $blue;
}

.math-document.teal h1::after {
  background-color: $teal;
}

.math-document.amber h1::after {
  background-color: $yellow;
}
</style>
