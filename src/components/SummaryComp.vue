<script setup lang="ts">
import { CurrentMeasurement } from '../types/response-types'
import { useVModels } from '@vueuse/core'
import { timescaleOptions } from '../shared/options'
import { ref, getCurrentInstance } from 'vue'
import CallDoctorModal from '../components/modal/CallDoctorModal.vue'
import TerminateModal from '../components/modal/TerminateModal.vue'

const app = getCurrentInstance()
const dayjs = app?.appContext.config.globalProperties.$dayjs

interface Props {
  measurement: CurrentMeasurement | undefined
  timescale: number
  isAuto: boolean
  playback: boolean
}
const props = withDefaults(defineProps<Props>(), {
  measurement: undefined,
  playback: false,
})

interface Emits {
  (e: 'update:isAuto', value: boolean): void
  (e: 'update:timescale', value: number): void
  (e: 'onLatestClicked', value: null): void
  (e: 'onPrevClicked', value: null): void
  (e: 'onNextClicked', value: null): void
}
const emit = defineEmits<Emits>()
const { timescale, isAuto } = useVModels(props, emit)

const isOpenCallDoctor = ref<boolean>(false)
const isOpenTermination = ref<boolean>(false)
</script>

<template>
  <terminate-modal
    v-if="isOpenTermination && measurement"
    :measurement="measurement"
    @on-close-clicked="isOpenTermination = false"
  />
  <call-doctor-modal
    v-if="isOpenCallDoctor && measurement && measurement.latestEvent"
    :measurement="measurement"
    @on-close-clicked="isOpenCallDoctor = false"
  />

  <section class="content-summary" v-if="measurement">
    <div class="summary-left">
      <div class="summary-meta">
        <div class="summary__id">
          <i class="fa-solid fa-person-pregnant"></i>{{ measurement.code }}
        </div>
        <div class="summary__date">
          <i class="fa-regular fa-clock"></i>
          <div class="date-start">
            {{ dayjs(measurement.firstTime).format('HH:mm:ss') }}
            <span class="utc"
              >UTC: {{ dayjs(measurement.firstTime).utc().format('HH:mm:ss') }}</span
            >
          </div>
          <div class="date-range"></div>
          <i class="fa-regular fa-clock"></i>
          <div class="date-end">
            {{ dayjs(measurement.lastTime).format('HH:mm:ss') }}
            <span class="utc"
              >UTC: {{ dayjs(measurement.lastTime).utc().format('HH:mm:ss') }}</span
            >
          </div>
        </div>
      </div>
      <div class="summary-list">
        <dl>
          <div>
            <dt>
              <i class="fa-solid fa-arrow-trend-up"></i><span>{{ $t('BaseLine') }}</span>
            </dt>
            <dd>
              <template
                v-if="
                  measurement.latestEvent &&
                  measurement.latestEvent.diagnosis &&
                  measurement.latestEvent.diagnosis.baselineBpm
                "
              >
                {{ measurement.latestEvent.diagnosis.baselineBpm }}
              </template>
              <template v-else>N/A </template>
            </dd>
          </div>
          <div>
            <dt>
              <i class="fa-solid fa-arrow-down-up-across-line"></i
              ><span>{{ $t('Valiability') }}</span>
            </dt>
            <dd>
              <template
                v-if="
                  measurement.latestEvent &&
                  measurement.latestEvent.diagnosis &&
                  measurement.latestEvent.diagnosis.variabilityBpm
                "
              >
                {{ measurement.latestEvent.diagnosis.variabilityBpm }}
              </template>
              <template v-else>N/A </template>
            </dd>
          </div>
        </dl>
        <dl>
          <div>
            <dt>
              <template
                v-if="
                  measurement.latestEvent && measurement.latestEvent.type == 'annotation'
                "
              >
                <i class="fa-solid fa-user-nurse"></i><span>MIDWIFE</span>
              </template>
              <template v-else>
                <i class="fa-solid fa-rainbow"></i><span>JUDY</span>
              </template>
            </dt>
            <dd>
              <template v-if="measurement.latestEvent && measurement.latestEvent.risk">
                {{ $t('risk') }}:{{ measurement.latestEvent.risk }}
              </template>
              <template v-else>N/A</template>
            </dd>
          </div>
          <div>
            <dt>
              <i class="fa-solid fa-briefcase-medical"></i
              ><span>{{ $t('intervention') }}</span>
            </dt>
            <dd>
              <template v-if="measurement.lastestIntervention">
                {{ $t(measurement.lastestIntervention.interventionKind) }}
              </template>
              <template v-else>N/A </template>
            </dd>
          </div>
        </dl>
      </div>

      <div class="summary-btn-end" v-if="!playback">
        <a class="btn btn-end" href="" @click.stop.prevent="isOpenTermination = true">
          <div>
            <i class="fa-regular fa-circle-stop"></i>
            <span>{{ $t('terminate') }}</span>
          </div>
        </a>
      </div>
      <div class="summary-btn-call" v-if="!playback">
        <a class="btn btn-call" href="" @click.stop.prevent="isOpenCallDoctor = true"
          ><i class="fa-solid fa-phone-volume"></i>Call Doctor</a
        >
      </div>
    </div>
    <!-- /.summary-left -->

    <div class="summary-right">
      <div class="summary-control">
        <div class="control-btn">
          <a
            v-if="!playback"
            class="btn btn-auto"
            href=""
            :class="{
              'is-active': isAuto,
            }"
            @click.stop.prevent="isAuto = !isAuto"
            >AUTO</a
          >
          <div class="control-pager">
            <a
              href=""
              class="btn btn-pager pager__prev"
              :class="{
                'is-disabled': isAuto,
              }"
              @click.stop.prevent="emit('onPrevClicked', null)"
            ></a>
            <div class="select__wrap">
              <select name="name" id="name" v-model="timescale">
                <option v-for="ts in timescaleOptions" :key="ts.value" :value="ts.value">
                  {{ $t(ts.label) }}
                </option>
              </select>
            </div>
            <a
              href=""
              class="btn btn-pager pager__next"
              :class="{
                'is-disabled': isAuto,
              }"
              @click.stop.prevent="emit('onNextClicked', null)"
            ></a>
          </div>
          <a
            class="btn btn-latest"
            href=""
            :class="{
              'is-disabled': isAuto,
            }"
            @click.stop.prevent="emit('onLatestClicked', null)"
            >{{ $t('latest') }}</a
          >
        </div>
      </div>
      <!--
      <a v-if="!playback" class="btn btn-mute" href=""
        ><i class="fa-solid fa-bell-slash"></i>Mute</a
      >
      -->
    </div>
    <!-- /.summary-right -->
  </section>
  <!-- /.content-summary -->
</template>
