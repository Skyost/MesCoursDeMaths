<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{
  defaultX?: number
  defaultY?: number
}>(), {
  defaultX: 10,
  defaultY: 10
})

const draggableElement = ref<ComponentPublicInstance | null>(null)
const secondElement = ref<HTMLDivElement | null>(null)
const minuteElement = ref<HTMLDivElement | null>(null)
const hourElement = ref<HTMLDivElement | null>(null)

const getSecondsToday = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((now.getTime() - today.getTime()) / 1000)
}

const onResized = () => {
  const element = draggableElement.value!.$el
  const body = element.querySelector('.clock-container')
  const diameter = Math.min(body.offsetWidth, body.offsetHeight) - 40
  element.style.setProperty('--diameter', `${diameter}px`)
}

onMounted(async () => {
  await nextTick()
  const currentSec = getSecondsToday()

  const seconds = (currentSec / 60) % 1
  const minutes = (currentSec / 60 * 60) % 1
  const hours = (currentSec / 60 * 60 * 12) % 1

  const setTime = (left: number, hand: HTMLDivElement) => hand.style.animationDelay = (left * -1) + 's'

  setTime(60 * seconds, secondElement.value!)
  setTime(60 * 60 * minutes, minuteElement.value!)
  setTime(60 * 60 * 12 * hours, hourElement.value!)
  onResized()
})
</script>

<template>
  <draggable
    ref="draggableElement"
    class="draggable-text"
    title="Horloge"
    :default-x="defaultX"
    :default-y="defaultY"
    @resized="onResized"
  >
    <div class="clock-container">
      <div class="clock">
        <div
          ref="secondElement"
          class="second"
        />
        <div
          ref="minuteElement"
          class="minute"
        />
        <div
          ref="hourElement"
          class="hour"
        />
        <div class="axis" />
        <div
          v-for="i in [...Array(60).keys()]"
          :key="`indicator-${i}`"
          class="indicator"
          :class="`indicator-${i + 1}`"
        />
      </div>
    </div>
  </draggable>
</template>

<style lang="scss" scoped>
@import 'assets/colors';

.clock-container {
  height: 100%;
  width: 100%;
  padding: 20px;

  .clock {
    margin: auto;
    width: var(--diameter);
    height: var(--diameter);
    border-radius: 100%;
    display: flex;
    justify-content: center;
    position: relative;

    .second,
    .minute,
    .hour,
    .indicator {
      position: absolute;
      left: calc(50% - 1px);
      width: 2px;
      background: $dark;
      transform-origin: bottom center;
      z-index: 2;
      border-radius: 1px;
    }

    .second {
      height: calc((100% / 2) - 10px);
      margin-top: 10px;
      background: $primary;
      animation: time 60s infinite steps(60);
      z-index: 3;
    }

    .minute {
      height: calc((100% / 2) - 20px);
      margin-top: 20px;
      opacity: 0.75;
      animation: time 3600s linear infinite;
    }

    .hour {
      height: calc((100% / 2) - 40px);
      margin-top: 40px;
      animation: time 43200s linear infinite;
    }

    .indicator {
      height: calc((100% / 2) - 2px);
      border-top: 2px solid $dark;
      background: none;

      @for $i from 1 through 60 {
        &.indicator-#{$i + 1} {
          transform: rotateZ(calc(6deg * #{$i}));
        }
      }

      &:nth-of-type(5n) {
        opacity: 1;
        height: calc((100% / 2) - 2px);
        border-top: 7px solid $primary;
      }
    }

    .axis {
      background: $primary;
      width: 5px;
      height: 5px;
      border-radius: 3px;
      position: absolute;
      z-index: 4;
      top: calc((100% / 2) - 3px);
    }
  }
}

@keyframes time {
  to {
    transform: rotateZ(360deg);
  }
}
</style>
