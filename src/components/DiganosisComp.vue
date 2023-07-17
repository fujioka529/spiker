<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { Event, Intervention } from '../types/response-types'

const app = getCurrentInstance()
const dayjs = app?.appContext.config.globalProperties.$dayjs

interface Props {
  events: Event[]
  interventions: Intervention[]
}
const props = defineProps<Props>()

interface Emits {
  (e: 'onDeleteIntervention', value: number): void
}
const emit = defineEmits<Emits>()

type EventType = 'JUDY' | 'INTERVENTION'
const activeTab = ref<EventType | undefined>()
</script>

<template>
  <section class="content-footer">
    <ul class="content-footer-tab">
      <li
        :class="{
          'is-active': activeTab == 'JUDY',
        }"
      >
        <a @click.stop.prevent="activeTab = 'JUDY'"
          ><i class="fa-solid fa-rainbow"></i>JUDY</a
        >
      </li>
      <li
        :class="{
          'is-active': activeTab == 'INTERVENTION',
        }"
      >
        <a @click.stop.prevent="activeTab = 'INTERVENTION'">INTERVENTION</a>
      </li>
      <li class="panel-close" v-if="activeTab != undefined">
        <a @click.stop.prevent="activeTab = undefined"
          ><i class="fa-solid fa-arrow-down-long"></i
        ></a>
      </li>
    </ul>

    <div
      class="content-footer-panel"
      :class="{
        'is-active': activeTab != undefined,
      }"
    >
      <div
        class="footer-panel__content footer-panel__judy"
        :class="{
          'is-active': activeTab == 'JUDY',
        }"
      >
        <ul class="footer-panel__list">
          <li class="footer-panel__item" v-for="event in events" :key="event.id">
            <div class="item__title">
              <span>
                {{ dayjs(event.rangeFrom).format('HH:mm:ss') }}
                ~
                {{ dayjs(event.rangeUntil).format('HH:mm:ss') }}
              </span>
            </div>
            <div class="" v-if="event.diagnosis">
              <template v-if="event.diagnosis.baseline">
                <p>{{ $t('BaseLine') }} {{ event.diagnosis.baselineBpm }}bpm</p>
              </template>
              <template
                v-if="event.diagnosis.variability && event.diagnosis.variabilityBpm"
              >
                <p>
                  {{ $t('Valiability') }}: {{ event.diagnosis.variabilityBpm }}bpm
                </p></template
              >
              <template v-if="event.risk"
                ><p>{{ $t('risk') }} {{ event.risk }}</p>
                <p>{{ $t('risk' + event.risk) }}</p>
              </template>
            </div>
          </li>
        </ul>
      </div>

      <div
        class="footer-panel__content footer-panel__intervention"
        :class="{
          'is-active': activeTab == 'INTERVENTION',
        }"
      >
        <ul class="footer-panel__list">
          <li
            class="footer-panel__item"
            v-for="intervention in interventions"
            :key="intervention.id"
          >
            <div class="item__title">
              <span
                >{{ dayjs(intervention.rangeFrom).format('HH:mm:ss') }}
                ~
                {{ dayjs(intervention.rangeUntil).format('HH:mm:ss') }}</span
              >
              <span
                ><a
                  href=""
                  @click.stop.prevent="emit('onDeleteIntervention', intervention.id)"
                >
                  <i class="fa-solid fa-trash"></i> </a
              ></span>
            </div>
            <div class="">
              <template v-if="intervention.isIntervention">
                {{ $t(intervention.interventionKind) }} <br />
              </template>
              <template v-if="intervention.uterusOstium">
                {{ $t('uterusOstium') }}: {{ intervention.uterusOstium }} cm <br />
              </template>
              {{ $t('memo') }}：{{ intervention.memo }}
            </div>
          </li>
        </ul>
      </div>

      <!--
      <div class="footer-panel__control">
        <a href=""><i class="fa-solid fa-clock-rotate-left"></i></a>
        <a href=""><i class="fa-solid fa-magnifying-glass-plus"></i></a>
      </div>
-->
    </div>
  </section>
</template>
