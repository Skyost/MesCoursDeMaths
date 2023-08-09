<script setup lang="ts">
const props = defineProps<{ dates: string[] }>()

const emit = defineEmits<{(event: 'dayclick', date: string): void}>()

const month = ref<number>(new Date().getMonth())
const year = ref<number>(new Date().getFullYear())

const formattedMonth = computed(() => {
  const date = new Date(year.value, month.value)
  const formattedMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' })
  return formattedMonth[0].toUpperCase() + formattedMonth.substring(1)
})

const nextMonday = computed(() => {
  const result = new Date(year.value, month.value)
  while (result.getDay() !== 1) {
    result.setDate(result.getDate() + 1)
  }
  return result
})

const firstDate = computed(() => {
  const result = new Date(year.value, month.value)
  while (result.getDay() !== 1) {
    result.setDate(result.getDate() - 1)
  }
  return result
})

const lastDate = computed(() => {
  const startOfTheMonth = new Date(year.value, month.value)
  const result = new Date(startOfTheMonth)
  while (result.getDay() !== 0) {
    result.setDate(result.getDate() + 1)
  }
  while (result.getMonth() === startOfTheMonth.getMonth()) {
    result.setDate(result.getDate() + 7)
  }
  return result
})

const weeks = computed(() => {
  return Math.ceil((lastDate.value.getTime() - firstDate.value.getTime()) / (1000 * 3600 * 24 * 7))
})

const goToPreviousMonth = () => {
  if (month.value === 0) {
    month.value = 11
    year.value = year.value - 1
    return
  }
  month.value--
}

const goToNextMonth = () => {
  if (month.value === 11) {
    month.value = 0
    year.value = year.value + 1
    return
  }
  month.value++
}

const getDateFromWeekAndDayOfWeek = (week: number, dayOfWeek: number) => {
  const result = new Date(firstDate.value)
  result.setDate(result.getDate() + dayOfWeek + (week * 7))
  return result
}

const formatDayOfMonth = (week: number, dayOfWeek: number) => getDateFromWeekAndDayOfWeek(week, dayOfWeek)
  .toLocaleString('default', { day: 'numeric', month: 'numeric' })

const formatDayOfWeek = (dayOfWeek: number) => {
  const nextMondayClone = new Date(nextMonday.value)
  nextMondayClone.setDate(nextMondayClone.getDate() + dayOfWeek - 1)
  const result = nextMondayClone.toLocaleString('default', { weekday: 'long' })
  return result[0].toUpperCase() + result.substring(1)
}

const onDayClicked = (week: number, dayOfWeek: number) => {
  const date = getDateFromWeekAndDayOfWeek(week, dayOfWeek)
  if (date.getMonth() === month.value) {
    emit('dayclick', formatDate(date))
  }
}

const getColDayClass = (week: number, dayOfWeek: number) => {
  const date = getDateFromWeekAndDayOfWeek(week, dayOfWeek)
  const yyyymmdd = formatDate(date)
  return {
    'has-content': props.dates.includes(yyyymmdd),
    disabled: date.getMonth() !== month.value
  }
}

const formatDate = (date: Date) => {
  const offset = date.getTimezoneOffset()
  const result = new Date(date.getTime() - (offset * 60 * 1000))
  return result.getFullYear() + '-' + ('0' + (result.getMonth() + 1)).slice(-2) + '-' + ('0' + result.getDate()).slice(-2)
}
</script>

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
