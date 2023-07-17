<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  inject,
  getCurrentInstance,
} from 'vue'
import { useRoute } from 'vue-router'
import useMeasurement from '../composables/net/measurement'
import { useControlPanelStore } from '../store/control_panel'
import { CurrentMeasurement, Intervention, Event } from '../types/response-types'
import SummaryComp from '../components/SummaryComp.vue'
import ChartComp from '../components/ChartComp.vue'
import DiganosisComp from '../components/DiganosisComp.vue'
import { dataIntervalMillSecs } from '../shared/consts'

const measurementId = computed(() => useRoute().params.id as string)

//const dayjs = inject("dayjs");
const app = getCurrentInstance()
const dayjs = app?.appContext.config.globalProperties.$dayjs
const t = app?.appContext.config.globalProperties.$t

const {
  fetchMeasurement,
  fetchHeartrates,
  fetchTocos,
  listEvents,
  listInterventions,
  deleteMedicalIntervention,
} = useMeasurement()
const measurement = ref<CurrentMeasurement>()

const store = useControlPanelStore()

const { isAuto, timescale } = toRefs(
  reactive({
    isAuto: false,
    timescale: store.timescale,
  })
)

// 時間範囲の変更。
watch(
  () => timescale.value,
  (value) => {
    store.timescale = value
    updateChartData()
  }
)

// 自動取得の変更。
watch(
  () => isAuto.value,
  (value) => {
    store.isAuto = value
  }
)

// 前ボタンクリック。
const onPrevClicked = () => {
  if (!isAuto.value) {
    const { prev } = store
    prev()
    updateChartData()
  }
}

// 次へボタンクリック。
const onNextClicked = () => {
  if (!isAuto.value) {
    const { next } = store
    next()
    updateChartData()
  }
}

// 最新ボタンクリック。
const onLatestClicked = () => {
  if (!isAuto.value) {
    const { latest } = store
    latest()
    updateChartData()
  }
}

// onDeleteIntervention
const onDeleteIntervention = async (interventionId: number) => {
  if (confirm(t('DeleteIntervention'))) {
    try {
      await deleteMedicalIntervention(measurement.value!.id, interventionId)
      interventions.value = interventions.value.filter((v) => v.id != interventionId)
    } catch (e) {
      alert(e)
    }
  }
}

const hrLabels = ref<number[]>([])
const hrValues = ref<number[]>([])
const tcLabels = ref<number[]>([])
const tcValues = ref<number[]>([])
const events = ref<Event[]>([])
const interventions = ref<Intervention[]>([])

const updateChartData = () => {
  if (measurement.value && store.end) {
    fetchHeartrates(
      measurement.value.id,
      store.end,
      store.timescale,
      dataIntervalMillSecs
    ).then((values) => {
      hrLabels.value = values[0]
      hrValues.value = values[1]
    })
    fetchTocos(
      measurement.value.id,
      store.end,
      store.timescale,
      dataIntervalMillSecs
    ).then((values) => {
      tcLabels.value = values[0]
      tcValues.value = values[1]
    })
  }
}

const updateEventData = () => {
  if (measurement.value) {
    listEvents(measurement.value?.id, store.eventStart).then((values) => {
      if (values.length > 0) {
        events.value = events.value.concat(values)
        events.value.sort((a, b) => {
          return dayjs(a.rangeFrom).unix() < dayjs(b.rangeFrom).unix() ? -1 : 1
        })
        store.eventStart = values[values.length - 1].id
      }
    })
    listInterventions(measurement.value?.id, store.inventionStart).then((values) => {
      if (values.length > 0) {
        interventions.value = interventions.value.concat(values)
        interventions.value.sort((a, b) => {
          return dayjs(a.rangeFrom).unix() < dayjs(b.rangeFrom).unix() ? -1 : 1
        })
        store.inventionStart = values[values.length - 1].id
      }
    })
  }
}

onMounted(async () => {
  let id = parseInt(measurementId.value)
  measurement.value = await fetchMeasurement(id)
  const { setTime } = store
  setTime(measurement.value.firstTime, measurement.value.lastTime)
  updateChartData()
  updateEventData()
})
</script>

<template>
  <div
    v-if="measurement"
    class="content-main content-measurement"
    :class="{
      'status-success': !measurement.risky,
      'status-warning': measurement.risky && measurement.latestEvent.risk == 3,
      'status-danger': measurement.risky && measurement.latestEvent.risk > 3,
    }"
  >
    <!-- content-summary -->
    <summary-comp
      v-model:measurement="measurement"
      v-model:timescale="timescale"
      v-model:is-auto="isAuto"
      :playback="true"
      @on-latest-clicked="onLatestClicked"
      @on-prev-clicked="onPrevClicked"
      @on-next-clicked="onNextClicked"
    />
    <!-- section chart -->
    <chart-comp
      :measurement-id="measurement.id"
      :hr-labels="hrLabels"
      :hr-values="hrValues"
      :tc-labels="tcLabels"
      :tc-values="tcValues"
      :events="events"
      :interventions="interventions"
    />
    <!-- section content-footer -->
    <diganosis-comp
      v-model:events="events"
      v-model:interventions="interventions"
      @on-delete-intervention="onDeleteIntervention"
    />
  </div>
</template>

<style scoped>
.content-measurement {
  height: 100% !important;
}
</style>
