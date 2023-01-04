<template>
  <draggable
    class="draggable-stopwatch"
    title="Chronomètre"
    :default-x="400 + index * 10"
    :default-y="400 + index * 10"
    @close="togglePlay"
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

<script>
import { SkiButton, SkiColumn, SkiColumns, SkiIcon } from 'skimple-components'
import Draggable from '~/components/Applications/Whiteboard/Draggable'

export default {
  components: { Draggable, SkiButton, SkiIcon, SkiColumns, SkiColumn },
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      seconds: 0,
      intervalID: null
    }
  },
  computed: {
    isPaused () {
      return this.intervalID === null
    },
    secondCount () {
      return this.seconds % 10
    },
    tenSecondCount () {
      return (~~(this.seconds / 10)) % 6
    },
    minuteCount () {
      return ~~(this.seconds / 60) % 10
    },
    tenMinuteCount () {
      return ~~(this.seconds / 600)
    }
  },
  methods: {
    togglePlay () {
      if (this.seconds >= 0) {
        if (this.isPaused) {
          this.intervalID = setInterval(() => {
            this.changeSeconds(this.seconds - 1)
            if (this.seconds <= 0) {
              clearInterval(this.intervalID)
              this.intervalID = null
            }
          }, 1000)
        } else {
          clearInterval(this.intervalID)
          this.intervalID = null
        }
      }
    },
    changeSeconds (newSeconds) {
      if (newSeconds <= 0) {
        newSeconds = 0
      }
      if (newSeconds >= 90 * 60) {
        newSeconds = 90 * 60
      }
      this.seconds = newSeconds
    }
  }
}
</script>

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
