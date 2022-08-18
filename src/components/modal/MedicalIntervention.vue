<script setup lang="ts">
import { useVModels } from "@vueuse/core";
import dayjs from "dayjs";
import { ref, watch } from "vue";
import { medicalInterventionOptions } from "../../shared/options";
import useMeasurement from "../../composables/net/measurement";

import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { MedicalInterventionBody } from "../../types/request-types";

interface Props {
  measurementId: number;
  beginTime: number;
  endTime: number;
}
const props = defineProps<Props>();

interface Emits {
  (e: "onCloseClicked", value: null): void;
}
const emit = defineEmits<Emits>();

const begin = ref<string>(
  dayjs.unix(props.beginTime / 1000.0).format("YYYY-MM-DD HH:mm:ss")
);
const end = ref<string>(dayjs.unix(props.endTime / 1000.0).format("YYYY-MM-DD HH:mm:ss"));

watch(
  () => begin.value,
  (value) => {
    if (new Date(begin.value).getTime() > new Date(end.value).getTime()) {
      end.value = begin.value;
    }
  }
);

const medicalIntervention = ref<string>();
const uterusOstium = ref<number>();
const memo = ref<string>("");

const { createMedicalIntervention } = useMeasurement();

const onOKClicked = async () => {
  var body: MedicalInterventionBody = {
    rangeFrom: new Date(begin.value).toISOString(),
    rangeUntil: new Date(end.value).toISOString(),
    memo: memo.value,
    isIntervention: false,
    interventionKind: "",
    uterusOstium: null,
  };
  if (medicalIntervention.value) {
    body.isIntervention = true;
    body.interventionKind = medicalIntervention.value;
  } else {
    body.isIntervention = false;
  }
  if (uterusOstium.value) {
    body.uterusOstium = uterusOstium.value;
  }

  await createMedicalIntervention(props.measurementId, body);
  emit("onCloseClicked", null);
};
</script>

<template>
  <div class="modal active">
    <div class="modal__main modal__lg">
      <div class="modal__close">
        <a href="" class="modal__close__btn"
          ><i class="fas fa-times" @click.stop.prevent="emit('onCloseClicked', null)"></i
        ></a>
      </div>
      <h2 class="modal__heading">{{ $t("medicalIntervention") }}</h2>
      <section class="modal__content">
        <form>
          <div class="item-row">
            <div class="item">
              <label class="label">{{ $t("beginTime") }}(*)</label>
              <!--
              <input class="inputs" type="text" name="name" v-model="begin" />
              -->
              <Datepicker v-model="begin" />
            </div>
            <!-- /.item -->
            <div class="item">
              <label class="label">{{ $t("endTime") }}</label>
              <!--
              <input class="inputs" type="text" name="name" v-model="end" />
              -->
              <Datepicker v-model="end" />
            </div>
            <!-- /.item -->
          </div>
          <!-- /.item-row -->

          <div class="item-box">
            <div class="item">
              <p class="label label-point">{{ $t("medicalIntervention") }}</p>
              <div class="inputs">
                <template v-for="mi in medicalInterventionOptions" :key="mi.label">
                  <input
                    :id="mi.label"
                    type="radio"
                    v-model="medicalIntervention"
                    :value="mi.value"
                  /><label :for="mi.label">{{ $t(mi.label) }}</label
                  ><br />
                </template>
              </div>
            </div>
          </div>
          <!-- /.item-row -->

          <div class="item-row">
            <div class="item item-flex">
              <label class="label">{{ $t("uterusOstium") }}</label>
              <input class="inputs input__half" type="number" v-model="uterusOstium" />
              <label class="label">cm</label>
            </div>
            <!-- /.item -->
          </div>
          <!-- /.item-row -->

          <div class="item-row">
            <div class="item">
              <textarea placeholder="memo" v-model="memo"></textarea>
            </div>
            <!-- /.item -->
          </div>
          <!-- /.item-row -->

          <div class="modal__bottom">
            <button
              type="button"
              class="modal-btn__cancel"
              @click="emit('onCloseClicked', null)"
            >
              Cancel
            </button>
            <button type="button" class="modal-btn__submit" @click="onOKClicked">
              OK
            </button>
            <!-- // .modal__bottom -->
          </div>
        </form>
      </section>
    </div>
  </div>
  <!-- /.modal -->

  <div id="modal-overlay" class="active"></div>
</template>

<style>
.dp__pointer {
  font-size: 12pt;
}
</style>
