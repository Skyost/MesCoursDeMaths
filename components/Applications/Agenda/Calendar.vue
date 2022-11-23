<template>
  <div>
    <ski-columns>
      <ski-column width="3" md="2">
        <ski-button @click="goToPreviousMonth">
          <ski-icon icon="arrow-left" />
        </ski-button>
      </ski-column>
      <ski-column width="6" md="8" class="col-month">
        <span class="month" v-text="formattedMonth" />
      </ski-column>
      <ski-column width="3" md="2" class="text-end">
        <ski-button @click="goToNextMonth">
          <ski-icon icon="arrow-right" />
        </ski-button>
      </ski-column>
    </ski-columns>
    <ski-columns>
      <ski-column
        v-for="dayOfWeek in 7"
        :key="`day-of-week-${dayOfWeek}`"
        class="col-weekday d-none d-md-block"
      >
        {{ formatDayOfWeek(dayOfWeek) }}
      </ski-column>
    </ski-columns>
    <ski-columns
      v-for="week in weeks"
      :key="`week-${week}`"
    >
      <ski-column
        v-for="dayOfWeek in 7"
        :key="`day-${week}-${dayOfWeek}`"
        class="col-day"
        :class="getColDayClass(week - 1, dayOfWeek)"
      >
        <span
          class="day"
          @click="onDayClicked(week - 1, dayOfWeek)"
          v-text="formatDayOfMonth(week - 1, dayOfWeek)"
        />
      </ski-column>
    </ski-columns>
  </div>
</template>

<script>
import { SkiButton, SkiColumn, SkiColumns, SkiIcon } from 'skimple-components'

export default {
  name: 'Calendar',
  components: { SkiIcon, SkiButton, SkiColumns, SkiColumn },
  props: {
    dates: {
      type: Array,
      required: true
    }
  },
  emits: ['dayclick'],
  data () {
    const date = new Date()
    return {
      month: date.getMonth(),
      year: date.getFullYear()
    }
  },
  computed: {
    formattedMonth () {
      const date = new Date(this.year, this.month)
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' })
      return month[0].toUpperCase() + month.substring(1)
    },
    nextMonday () {
      const result = new Date(this.year, this.month)
      while (result.getDay() !== 1) {
        result.setDate(result.getDate() + 1)
      }
      return result
    },
    firstDate () {
      const result = new Date(this.year, this.month)
      while (result.getDay() !== 1) {
        result.setDate(result.getDate() - 1)
      }
      return result
    },
    lastDate () {
      const startOfTheMonth = new Date(this.year, this.month)
      const result = new Date(startOfTheMonth)
      while (result.getDay() !== 0) {
        result.setDate(result.getDate() + 1)
      }
      while (result.getMonth() === startOfTheMonth.getMonth()) {
        result.setDate(result.getDate() + 7)
      }
      return result
    },
    weeks () {
      return Math.ceil((this.lastDate.getTime() - this.firstDate.getTime()) / (1000 * 3600 * 24 * 7))
    }
  },
  methods: {
    goToPreviousMonth () {
      if (this.month === 0) {
        this.month = 11
        this.year = this.year - 1
        return
      }
      this.month--
    },
    goToNextMonth () {
      if (this.month === 11) {
        this.month = 0
        this.year = this.year + 1
        return
      }
      this.month++
    },
    getDateFromWeekAndDayOfWeek (week, dayOfWeek) {
      const result = new Date(this.firstDate)
      result.setDate(result.getDate() + dayOfWeek + (week * 7))
      return result
    },
    formatDayOfMonth (week, dayOfWeek) {
      const date = this.getDateFromWeekAndDayOfWeek(week, dayOfWeek)
      return date.toLocaleString('default', { day: 'numeric', month: 'numeric' })
    },
    formatDayOfWeek (dayOfWeek) {
      const nextMonday = new Date(this.nextMonday)
      nextMonday.setDate(nextMonday.getDate() + dayOfWeek - 1)
      const result = nextMonday.toLocaleString('default', { weekday: 'long' })
      return result[0].toUpperCase() + result.substring(1)
    },
    onDayClicked (week, dayOfWeek) {
      const date = this.getDateFromWeekAndDayOfWeek(week, dayOfWeek)
      if (date.getMonth() === this.month) {
        this.$emit('dayclick', this.formatDate(date))
      }
    },
    getColDayClass (week, dayOfWeek) {
      const date = this.getDateFromWeekAndDayOfWeek(week, dayOfWeek)
      const yyyymmdd = this.formatDate(date)
      return {
        'has-content': this.dates.includes(yyyymmdd),
        disabled: date.getMonth() !== this.month
      }
    },
    formatDate (date) {
      const offset = date.getTimezoneOffset()
      const result = new Date(date.getTime() - (offset * 60 * 1000))
      return result.getFullYear() + '-' + ('0' + (result.getMonth() + 1)).slice(-2) + '-' + ('0' + result.getDate()).slice(-2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/bootstrap-mixins';

.col-month {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.5em;
  text-align: center;

  .month {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    display: inline-block;
  }
}

.col-weekday {
  padding-top: calc(var(--bs-gutter-x) * 0.5);
  text-align: center;
  font-weight: bold;
}

.col-day {
  padding-top: calc(var(--bs-gutter-x) * 0.5);
  padding-bottom: calc(var(--bs-gutter-x) * 0.5);

  .day {
    display: block;
    padding: 8px;
    min-height: 100px;
    transition: background-color 200ms;
    font-size: 0.8em;
    background-color: var(--bs-dark);
    color: var(--bs-light);
    cursor: pointer;

    &:hover {
      background-color: var(--bs-gray-800);
    }
  }

  &.has-content .day {
    background-color: var(--bs-green);
  }

  &.disabled {
    .day {
      cursor: not-allowed;
      background-color: var(--bs-light);
      color: var(--bs-gray-700);
    }

    @include media-breakpoint-down(sm) {
      display: none;
    }
  }

  &.has-content .day:hover {
    background-color: darken(#198754, 5%);
  }

  &.disabled .day:hover {
    background-color: var(--bs-light);
  }

  @include media-breakpoint-down(sm) {
    flex-basis: auto;
  }
}
</style>
