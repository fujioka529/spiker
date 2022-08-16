import { be } from 'date-fns/locale'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { defaultDataMinutes } from '../shared/consts'

export const useControlPanelStore = defineStore('controlPanel', () => {
  const isAuto = ref<boolean>(true)
  const timescale = ref<number>(defaultDataMinutes)
  const end = ref<string>()
  const firstTime = ref<string>()
  const lastTime = ref<string>()

  const eventStart = ref<number>()
  const inventionStart = ref<number>()

  const prev = () => {
    let candidate = dayjs(end.value).unix() - timescale.value * 60
    if (candidate > dayjs(firstTime.value).unix()) {
      end.value = dayjs.unix(candidate).toISOString()
    }
  }
  const next = () => {
    let candidate = dayjs(end.value).unix() + timescale.value * 60
    if (candidate < dayjs(lastTime.value).unix()) {
      end.value = dayjs.unix(candidate).toISOString()
    }
  }

  const latest = () => {
    end.value = lastTime.value
    console.log(dayjs(end.value).unix())
  }

  const setTime = (first: string, last: string) => {
    firstTime.value = first
    lastTime.value = last
    end.value = last
  }

  const resetEvents = () => {
    eventStart.value = undefined
    inventionStart.value = undefined
  }

  return {
    isAuto,
    timescale,
    end,
    prev,
    next,
    latest,
    setTime,
    eventStart,
    inventionStart,
    resetEvents,
  }
})
