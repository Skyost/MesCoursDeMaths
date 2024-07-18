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
const timeElement = ref<HTMLSpanElement | null>(null)

let timeoutId: any | null = null
let intervalId: any | null = null

const getTodaySecondsElapsed = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return (now.getTime() - today.getTime()) / 1000
}

const getNextMinuteDelay = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
  const plusOne = new Date(today.getTime() + 60 * 1000)
  return plusOne.getTime() - now.getTime()
}

const onResized = () => {
  const element = draggableElement.value!.$el
  const body = element.querySelector('.clock-container')
  const diameter = Math.min(body.offsetWidth, body.offsetHeight - timeElement.value!.offsetHeight)
  element.style.setProperty('--diameter', `${diameter}px`)
}

const updateTime = () => {
  const now = new Date()
  timeElement.value!.textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
}

onMounted(async () => {
  await nextTick()
  const currentSec = getTodaySecondsElapsed()

  const seconds = (currentSec / 60) % 1
  const minutes = (currentSec / (60 * 60)) % 1
  const hours = (currentSec / (60 * 60 * 12)) % 1

  const setTime = (left: number, hand: HTMLDivElement) => hand.style.animationDelay = (left * -1) + 's'

  setTime(60 * seconds, secondElement.value!)
  setTime(60 * 60 * minutes, minuteElement.value!)
  setTime(60 * 60 * 12 * hours, hourElement.value!)
  onResized()

  updateTime()
  timeoutId = setTimeout(() => {
    updateTime()
    timeoutId = null
    intervalId = setInterval(updateTime, 60 * 1000)
  }, getNextMinuteDelay())
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <draggable
    ref="draggableElement"
    class="draggable-clock"
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
      <div class="text-center">
        <span ref="timeElement">00:00</span>
      </div>
    </div>
  </draggable>
</template>

<style lang="scss" scoped>
@import 'assets/colors';

$min-size: 300px;
$hands-width: 2px;

.draggable-clock :deep(.card-body) {
  min-width: $min-size;
  min-height: $min-size;
}

.clock-container {
  height: 100%;
  width: 100%;
  min-width: calc($min-size - var(--bs-card-spacer-x) * 2);
  min-height: calc($min-size - var(--bs-card-spacer-y) * 2);
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 3em;
  letter-spacing: 0.2em;

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
      width: $hands-width;
      background: $dark;
      transform-origin: bottom center;
      z-index: 2;
      border-radius: calc($hands-width / 2);
      top: 0;
      left: calc(50% - ($hands-width / 2));
    }

    .second {
      $top-distance: 10px;

      height: calc(50% - $top-distance);
      margin-top: $top-distance;
      background: $primary;
      animation: time 60s infinite steps(60);
      z-index: 3;
    }

    .minute {
      $top-distance: 20px;

      height: calc(50% - $top-distance);
      margin-top: $top-distance;
      opacity: 0.75;
      animation: time 3600s linear infinite;
    }

    .hour {
      $top-distance: 40px;

      height: calc(50% - $top-distance);
      margin-top: $top-distance;
      animation: time 43200s linear infinite;
    }

    .indicator {
      height: 50%;
      border-top: 2px solid $dark;
      background: none;

      @for $i from 1 through 60 {
        &.indicator-#{$i + 1} {
          transform: rotateZ(calc(6deg * #{$i}));
        }
      }

      &:nth-of-type(5n) {
        opacity: 1;
        border-top: 7px solid $primary;
      }
    }

    .axis {
      $size: 5px;

      background: $dark;
      width: $size;
      height: $size;
      border-radius: 100%;
      position: absolute;
      z-index: 4;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@keyframes time {
  to {
    transform: rotateZ(360deg);
  }
}
</style>
