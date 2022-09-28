<template>
  <div class="math-document" :class="color">
    <h1 v-html="document.name" />
    <content-renderer class="math-document-content" :value="document" />
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
  data () {
    return {
      setupTimeout: null,
      initialDotsTimeout: null
    }
  },
  async mounted () {
    await this.$nextTick()
    this.setupTimeout = setTimeout(this.setupDocument, 1000)
    this.initialDotsTimeout = setTimeout(this.resizeDotLines, 1000)
    window.addEventListener('load', this.resizeDotLines)
    window.addEventListener('resize', this.resizeDotLines)
  },
  unmounted () {
    if (this.setupTimeout) {
      clearTimeout(this.setupTimeout)
      this.setupTimeout = null
    }
    if (this.initialDotsTimeout) {
      clearTimeout(this.initialDotsTimeout)
      this.initialDotsTimeout = null
    }
    window.removeEventListener('load', this.resizeDotLines)
    window.removeEventListener('resize', this.resizeDotLines)
  },
  methods: {
    setupDocument () {
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
      const flexGrows = this.$el.getElementsByClassName('flex-grow')
      for (const flexGrow of flexGrows) {
        for (const cssClass of ['d-flex', 'flex-column', 'flex-lg-row', 'align-items-center']) {
          flexGrow.parentElement.classList.add(cssClass)
        }
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
      this.setupTimeout = null
    },
    resizeDotLines () {
      const dotLines = this.$el.getElementsByClassName('dots')
      for (const dotLine of dotLines) {
        dotLine.innerHTML = '. . . '
        const originalHeight = dotLine.parentElement.offsetHeight
        while (dotLine.parentElement.offsetHeight === originalHeight) {
          if (!dotLine.parentElement.offsetWidth || dotLine.parentElement.offsetWidth <= 0) {
            break
          }
          dotLine.innerHTML += '. '
        }
        dotLine.innerHTML = dotLine.innerHTML.substring(0, Math.max(0, dotLine.innerHTML.length - 2))
      }
      this.initialDotsTimeout = null
    }
  }
}
</script>

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
  h1::after {
    display: block;
    content: '';
    width: 60px;
    height: 5px;
    margin: 10px 0 15px 0;
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
  @include bubble-style('📝 Exercice ' var(--number), #e0f2f1, #009688);
}

.bubble-information {
  @include bubble-style('☝ Information', #fce4ec, #e91e63);
}
</style>
