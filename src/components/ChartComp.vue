<script setup lang="ts">
import { ref, watch, getCurrentInstance } from 'vue'
import { Event, Intervention } from '../types/response-types'
import CTGChart from '../lib/chart'
import { Area } from '../shared/classes'
import Chart from 'chart.js/auto'
import MedicalIntervention from '../components/modal/MedicalIntervention.vue'
import Loading from '../components/Loading.vue'

const app = getCurrentInstance()
const dayjs = app?.appContext.config.globalProperties.$dayjs

interface Props {
  measurementId: number
  hrLabels: number[]
  hrValues: number[]
  tcLabels: number[]
  tcValues: number[]
  events: Event[]
  interventions: Intervention[]
}

const props = defineProps<Props>()

const hrChartRef = ref<HTMLCanvasElement>()
const tocoChartRef = ref<HTMLCanvasElement>()
const latestTime = ref<string>()

let hrChart: CTGChart | null = null
let tcChart: CTGChart | null = null

const beginTime = ref<number>()
const endTime = ref<number>()

const isOpenMedicalIntervention = ref<boolean>(false)

const updateArea = (chart: Chart, event: string, begin: number, end: number) => {
  const xscale = chart.scales['x']
  beginTime.value = xscale.getValueForPixel(begin)
  endTime.value = xscale.getValueForPixel(end)
  if (beginTime.value && endTime.value) {
    let area = new Area(begin, end, beginTime.value, endTime.value)
    hrChart?.drawArea(area)
    tcChart?.drawArea(area)

    if (event == 'mouseup') {
      setTimeout(() => {
        isOpenMedicalIntervention.value = true
      }, 500)
    }
  }
}

const onCloseMedicalIntervention = () => {
  isOpenMedicalIntervention.value = false
  hrChart?.drawArea(null)
  tcChart?.drawArea(null)
}

watch(
  () => hrChartRef.value,
  (newRef) => {
    hrChart = new CTGChart(newRef!.getContext('2d')!, {
      graphTitle: 'HR',
      borderColor: 'rgba(100, 100, 100, 1.0)',
      borderWidth: 1.0,
      updateDragArea: updateArea,
      yMin: 30.0,
      yMax: 200.0,
      isFHR: true,
    })
    hrChart?.updateData(props.hrLabels, props.hrValues)
  }
)

watch(
  () => tocoChartRef.value,
  (newRef) => {
    tcChart = new CTGChart(newRef!.getContext('2d')!, {
      graphTitle: 'TOCO',
      borderColor: 'rgba(100, 100, 100, 1.0)',
      borderWidth: 1.0,
      updateDragArea: undefined,
      yMin: 0.0,
      yMax: 100.0,
      isFHR: false,
    })
    tcChart?.updateData(props.tcLabels, props.tcValues)
  }
)

watch(
  () => props.hrLabels,
  () => {
    hrChart?.updateData(props.hrLabels, props.hrValues)
    if (props.hrLabels.length > 0) {
      latestTime.value = dayjs
        .unix(props.hrLabels[props.hrLabels.length - 1] / 1000.0)
        .toISOString()
    }
  }
)

watch(
  () => props.tcLabels,
  () => {
    tcChart?.updateData(props.tcLabels, props.tcValues)
  }
)

watch(
  () => props.events,
  () => {
    hrChart?.updateEvents(props.events)
  }
)

watch(
  () => props.interventions,
  () => {
    hrChart?.updateInterventions(props.interventions)
  }
)

const loading = ref<boolean>(true)
</script>

<template>
  <section class="content-chart">
    <div class="chart-area chart-main">
      <div class="chart__time">
        <span>{{ dayjs(latestTime).format('HH:mm:ss') }}</span> / UTC:
        {{ dayjs(latestTime).utc().format('HH:mm:ss') }}
      </div>
      <h2 class="chart__title"><i class="fa-solid fa-heart"></i>Heart Rate</h2>
      <div class="wrap-chart">
        <div class="chart-container chart-heart-rate">
          <canvas id="mychart" ref="hrChartRef"></canvas>
        </div>
      </div>
    </div>
    <div class="chart-area chart-sub">
      <h2 class="chart__title"><i class="fa-solid fa-person-pregnant"></i>TOCO</h2>
      <div class="wrap-chart">
        <div class="chart-container chart-toco-rate">
          <canvas id="mychart2" ref="tocoChartRef"></canvas>
        </div>
      </div>
    </div>
  </section>
  <!-- /.content-chart -->
  <medical-intervention
    v-if="isOpenMedicalIntervention && beginTime && endTime"
    @on-close-clicked="onCloseMedicalIntervention"
    :measurement-id="measurementId"
    :begin-time="beginTime"
    :end-time="endTime"
  />
</template>

<style>
.chart-heart-rate {
  height: 35vh !important;
}

.chart-toco-rate {
  height: 23vh !important;
}
</style>
