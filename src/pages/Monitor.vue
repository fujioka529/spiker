<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  getCurrentInstance,
} from 'vue'
import { useRoute } from 'vue-router'
import { timescaleOptions } from '../shared/options'
import SummaryComp from '../components/SummaryComp.vue'
import ChartComp from '../components/ChartComp.vue'
import DiganosisComp from '../components/DiganosisComp.vue'
import SoundConfirm from '../components/modal/SoundConfirm.vue'
import Loading from '../components/Loading.vue'
import { dataIntervalMillSecs } from '../shared/consts'
import useMeasurement from '../composables/net/measurement'
import { timerIntervals } from '../shared/consts'
import { CurrentMeasurement, Event, Intervention } from '../types/response-types'
import { alertManager } from '../lib/alert'
import { intervalManager } from '../lib/interval_manager'
import { useControlPanelStore } from '../store/control_panel'

const loading = ref<boolean>(true)
const activeTab = ref<number>(0)
// イベント

const {
  currentMeasurements,
  fetchHeartrates,
  fetchTocos,
  listEvents,
  listInterventions,
  deleteMedicalIntervention,
} = useMeasurement()
const measurements = ref<CurrentMeasurement[]>()
const selectedMeasurement = ref<CurrentMeasurement>()

const store = useControlPanelStore()

const { isAuto, timescale } = toRefs(
  reactive({
    isAuto: store.isAuto,
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

// 計測リクエスト。

watch(
  () => selectedMeasurement.value,
  (newValue, oldValue) => {
    if (newValue?.id != oldValue?.id) {
      // 別のグラフ取得に切りかえる。
      resetFetchTime()
    }
  }
)

const resetFetchTime = () => {
  if (selectedMeasurement.value) {
    const { setTime } = store
    setTime(selectedMeasurement.value.firstTime, selectedMeasurement.value.lastTime)
    updateChartData()
  }
}

// 計測中の一覧を取得する。측정 중인 목록을 가져옵니다.
const fetchCurrentMeasuments = async () => {
  let res = await currentMeasurements()
  measurements.value = res.measurements

  if (measurements.value.length == 0) {
    // 計測がなくなった場合。
    selectedMeasurement.value = undefined
    activeTab.value = 0
  } else {
    if (
      activeTab.value == 0 ||
      measurements.value.filter((m) => m.id == activeTab.value).length == 0
    ) {
      // 選択されているタブが存在しない場合。선택된 탭이 존재하지 않는 경우.
      // 選択中の計測が対象ではなくなった場合は変更する。선택 중인 측정이 더 이상 대상이 아닌 경우 변경합니다.
      selectedMeasurement.value = measurements.value[0]
      activeTab.value = measurements.value[0].id
      resetFetchTime()
      const { resetEvents } = store
      resetEvents()
      updateEventData()
    } else {
      let candidates = measurements.value.filter((m) => m.id == activeTab.value)
      if (candidates.length > 0) {
        // 新しい情報を設定する 새로운 정보 설정하기
        selectedMeasurement.value = candidates[0]
        if (store.isAuto) {
          resetFetchTime()
        }
        updateEventData()
      }
    }
  }

  if (!isOpenSoundConfirm.value) {
    // 現在の計測状況を更新してアラートを発動する。현재 측정 상황을 업데이트하여 경고를 발동한다.
    alertManager.updateMeasurements(measurements.value)
  }
}

const app = getCurrentInstance()
const dayjs = app?.appContext.config.globalProperties.$dayjs
const t = app?.appContext.config.globalProperties.$t

const hrLabels = ref<number[]>([])
const hrValues = ref<number[]>([])
const tcLabels = ref<number[]>([])
const tcValues = ref<number[]>([])
const events = ref<Event[]>([])
const interventions = ref<Intervention[]>([])

const updateChartData = () => {
  if (selectedMeasurement.value && store.end) {
    fetchHeartrates(
      selectedMeasurement.value.id,
      store.end,
      store.timescale,
      dataIntervalMillSecs
    ).then((values: [number[], number[]]) => {
      hrLabels.value = values[0]
      hrValues.value = values[1]
    })
    fetchTocos(
      selectedMeasurement.value.id,
      store.end,
      store.timescale,
      dataIntervalMillSecs
    ).then((values: [number[], number[]]) => {
      tcLabels.value = values[0]
      tcValues.value = values[1]
    })
  }
}

const updateEventData = () => {
  if (selectedMeasurement.value) {
    listEvents(selectedMeasurement.value?.id, store.eventStart).then(
      (values: Event[]) => {
        if (values.length > 0) {
          events.value = events.value.concat(values)
          events.value.sort((a, b) => {
            return dayjs(a.rangeFrom).unix() < dayjs(b.rangeFrom).unix() ? -1 : 1
          })
          store.eventStart = values[values.length - 1].id
        }
      }
    )
    listInterventions(selectedMeasurement.value?.id, store.inventionStart).then(
      (values: Intervention[]) => {
        if (values.length > 0) {
          interventions.value = interventions.value.concat(values)
          interventions.value.sort((a, b) => {
            return dayjs(a.rangeFrom).unix() < dayjs(b.rangeFrom).unix() ? -1 : 1
          })
          store.inventionStart = values[values.length - 1].id
        }
      }
    )
  }
}

const onMesurementSelected = (measurement: CurrentMeasurement) => {
  selectedMeasurement.value = measurement
  activeTab.value = measurement.id
}

// onDeleteIntervention
const onDeleteIntervention = async (interventionId: number) => {
  if (confirm(t('DeleteIntervention'))) {
    try {
      await deleteMedicalIntervention(selectedMeasurement.value!.id, interventionId)
      interventions.value = interventions.value.filter((v) => v.id != interventionId)
    } catch (e) {
      alert(e)
    }
  }
}

const isOpenSoundConfirm = ref<boolean>(true)

onMounted(() => {
  intervalManager.start('fetchCurrents', {
    callback: async () => {
      await fetchCurrentMeasuments()
    },
    delayMillisec: timerIntervals.currentMesurements,
    isImmediately: true,
  })
})

onBeforeUnmount(() => {
  intervalManager.stopAll()
})
</script>

<template>
  <sound-confirm @onOKClicked="isOpenSoundConfirm = false" v-if="isOpenSoundConfirm" />
  <div class="content-tab">
    <ul>
      <li
        v-for="me in measurements"
        :key="me.id"
        :class="{
          'tab-success': !me.risky,
          'tab-warning': me.risky && me.latestEvent.risk == 3,
          'tab-danger': me.risky && me.latestEvent.risk > 3,
          'is-active': activeTab == me.id,
        }"
      >
        <a @click.stop.prevent="onMesurementSelected(me)"
          ><i class="fa-solid fa-person-pregnant"></i>{{ me.code }}</a
        >
      </li>
    </ul>
  </div>
  <div
    v-if="selectedMeasurement"
    class="content-main"
    :class="{
      'status-success': !selectedMeasurement.risky,
      'status-warning':
        selectedMeasurement.risky && selectedMeasurement.latestEvent.risk == 3,
      'status-danger':
        selectedMeasurement.risky && selectedMeasurement.latestEvent.risk > 3,
    }"
  >
    <!-- content-summary -->
    <summary-comp
      v-model:measurement="selectedMeasurement"
      v-model:timescale="timescale"
      v-model:is-auto="isAuto"
      @on-latest-clicked="onLatestClicked"
      @on-prev-clicked="onPrevClicked"
      @on-next-clicked="onNextClicked"
      :playback="false"
    />
    <!-- section chart -->
    <chart-comp
      v-model:measurement-id="selectedMeasurement.id"
      v-model:hr-labels="hrLabels"
      v-model:hr-values="hrValues"
      v-model:tc-labels="tcLabels"
      v-model:tc-values="tcValues"
      v-model:events="events"
      v-model:interventions="interventions"
    />
    <!-- section content-footer -->
    <diganosis-comp
      v-model:events="events"
      v-model:interventions="interventions"
      @on-delete-intervention="onDeleteIntervention"
    />
  </div>
</template>
