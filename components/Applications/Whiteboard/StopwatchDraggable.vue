<script setup lang="ts">
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{
  defaultX?: number
  defaultY?: number
}>(), {
  defaultX: 10,
  defaultY: 10
})

const seconds = ref<number>(0)
const interval = ref<ReturnType<typeof setInterval> | null>(null)

const isPaused = computed(() => interval.value === null)
const secondCount = computed(() => seconds.value % 10)
const tenSecondCount = computed(() => (~~(seconds.value / 10)) % 6)
const minuteCount = computed(() => ~~(seconds.value / 60) % 10)
const tenMinuteCount = computed(() => ~~(seconds.value / 600))

const togglePlay = () => {
  if (seconds.value >= 0) {
    if (isPaused.value) {
      interval.value = setInterval(() => {
        changeSeconds(seconds.value - 1)
        if (seconds.value <= 0) {
          clearInterval(interval.value!)
          interval.value = null
        }
      }, 1000)
    }
    else {
      clearInterval(interval.value!)
      interval.value = null
    }
  }
}

const changeSeconds = (newSeconds: number) => {
  if (newSeconds <= 0) {
    newSeconds = 0
  }
  if (newSeconds >= 90 * 60) {
    newSeconds = 90 * 60
  }
  seconds.value = newSeconds
}
</script>

<template>
  <draggable
    class="draggable-stopwatch"
    title="Chronomètre"
    :default-x="defaultX"
    :default-y="defaultY"
    @closed="togglePlay"
  >
    <b-row class="h-100 ms-0 me-0">
      <b-col
        class="duration-column"
        width="2"
      >
        <b-button
          variant="light"
          @click="changeSeconds(seconds + 600)"
        >
          <icon name="bi:plus-lg" />
        </b-button>
        <span
          class="duration"
          v-text="tenMinuteCount"
        />
        <b-button
          variant="light"
          @click="changeSeconds(seconds - 600)"
        >
          <icon name="bi:dash-lg" />
        </b-button>
      </b-col>
      <b-col
        class="duration-column"
        width="2"
      >
        <b-button
          variant="light"
          @click="changeSeconds(seconds + 60)"
        >
          <icon name="bi:plus-lg" />
        </b-button>
        <span
          class="duration"
          v-text="minuteCount"
        />
        <b-button
          variant="light"
          @click="changeSeconds(seconds - 60)"
        >
          <icon name="bi:dash-lg" />
        </b-button>
      </b-col>
      <b-col
        class="duration-column"
        width="auto"
      >
        <span class="duration">:</span>
      </b-col>
      <b-col
        class="duration-column"
        width="2"
      >
        <b-button
          variant="light"
          @click="changeSeconds(seconds + 10)"
        >
          <icon name="bi:plus-lg" />
        </b-button>
        <span
          class="duration"
          v-text="tenSecondCount"
        />
        <b-button
          variant="light"
          @click="changeSeconds(seconds - 10)"
        >
          <icon name="bi:dash-lg" />
        </b-button>
      </b-col>
      <b-col
        class="duration-column"
        width="2"
      >
        <b-button
          variant="light"
          @click="changeSeconds(seconds + 1)"
        >
          <icon name="bi:plus-lg" />
        </b-button>
        <span
          class="duration"
          v-text="secondCount"
        />
        <b-button
          variant="light"
          @click="changeSeconds(seconds - 1)"
        >
          <icon name="bi:dash-lg" />
        </b-button>
      </b-col>
      <b-col
        class="ms-auto p-0 d-flex justify-content-center"
        width="1"
      >
        <b-button
          :disabled="seconds <= 0"
          @click="togglePlay"
        >
          <icon :name="isPaused ? 'bi:play-fill' : 'bi:pause'" />
        </b-button>
      </b-col>
    </b-row>
  </draggable>
</template>

<style lang="scss">
.draggable-stopwatch .card-body {
  align-items: center;
  text-align: center;
  min-height: 180px !important;
  min-width: 400px !important;

  .duration-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;

    .duration {
      font-weight: bold;
      font-size: 3em;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
