<script setup lang="ts">
import Draggable from '~/components/Applications/Whiteboard/Draggable.vue'

withDefaults(defineProps<{ index?: number }>(), { index: 0 })

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
    } else {
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
    :default-x="400 + index * 10"
    :default-y="400 + index * 10"
    @closed="togglePlay"
  >
    <ski-columns class="h-100 ms-0 me-0">
      <ski-column class="duration-column" width="2">
        <ski-button variant="success" @click="changeSeconds(seconds + 600)">
          <ski-icon icon="plus-lg" />
        </ski-button>
        <span class="duration" v-text="tenMinuteCount" />
        <ski-button variant="danger" @click="changeSeconds(seconds - 600)">
          <ski-icon icon="dash-lg" />
        </ski-button>
      </ski-column>
      <ski-column class="duration-column" width="2">
        <ski-button variant="success" @click="changeSeconds(seconds + 60)">
          <ski-icon icon="plus-lg" />
        </ski-button>
        <span class="duration" v-text="minuteCount" />
        <ski-button variant="danger" @click="changeSeconds(seconds - 60)">
          <ski-icon icon="dash-lg" />
        </ski-button>
      </ski-column>
      <ski-column class="duration-column" width="auto">
        <span class="duration">:</span>
      </ski-column>
      <ski-column class="duration-column" width="2">
        <ski-button variant="success" @click="changeSeconds(seconds + 10)">
          <ski-icon icon="plus-lg" />
        </ski-button>
        <span class="duration" v-text="tenSecondCount" />
        <ski-button variant="danger" @click="changeSeconds(seconds - 10)">
          <ski-icon icon="dash-lg" />
        </ski-button>
      </ski-column>
      <ski-column class="duration-column" width="2">
        <ski-button variant="success" @click="changeSeconds(seconds + 1)">
          <ski-icon icon="plus-lg" />
        </ski-button>
        <span class="duration" v-text="secondCount" />
        <ski-button variant="danger" @click="changeSeconds(seconds - 1)">
          <ski-icon icon="dash-lg" />
        </ski-button>
      </ski-column>
      <ski-column class="ms-auto p-0 d-flex justify-content-center" width="1">
        <ski-button :disabled="seconds <= 0" @click="togglePlay">
          <ski-icon :icon="isPaused ? 'play-fill' : 'pause'" />
        </ski-button>
      </ski-column>
    </ski-columns>
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
