<script setup lang="ts">
import path from "path";
import { ref } from "vue";
import useMeasurement from "../../composables/net/measurement";
import { CurrentMeasurement, Patient } from "../../types/response-types";
const loading = ref<boolean>(false);

const { updatePatient } = useMeasurement();

interface Props {
  patient: Patient;
}
const props = defineProps<Props>();

interface Emits {
  (e: "onCloseClicked", value: null): void;
}

const emit = defineEmits<Emits>();

const onUpdatePatient = async () => {
  if (props.patient.name == "") {
    return;
  }
  try {
    loading.value = true;
    await updatePatient(props.patient.id, {
      name: props.patient.name,
      memo: props.patient.memo,
    });
    emit("onCloseClicked", null);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <loading v-if="loading" />
  <div class="modal active">
    <div class="modal__main modal__m">
      <div class="modal__close">
        <a href="" class="modal__close__btn"
          ><i class="fas fa-times" @click.stop.prevent="emit('onCloseClicked', null)"></i
        ></a>
      </div>
      <h2 class="modal__heading">{{ $t("editPatientName") }}</h2>
      <section class="modal__content">
        <form>
          <p>{{ $t("enterNameAndMemo") }}</p>

          <div class="item-row">
            <div class="item">
              <input
                class="inputs"
                type="text"
                v-model="props.patient.name"
                :placeholder="$t('name')"
              />
            </div>
          </div>

          <div class="item-row">
            <div class="item">
              <div class="inputs">
                <textarea placeholder="memo" v-model="props.patient.memo"></textarea>
              </div>
            </div>
          </div>

          <div class="modal__bottom">
            <button
              type="button"
              class="modal-btn__cancel"
              @click.stop.prevent="emit('onCloseClicked', null)"
            >
              Cancel
            </button>
            <button type="button" class="modal-btn__submit" @click="onUpdatePatient">
              OK
            </button>
            <!-- // .modal__bottom -->
          </div>
        </form>
      </section>
    </div>
    <!-- // .modal-main -->
  </div>
  <!-- /.modal -->

  <div id="modal-overlay" class="active"></div>
</template>
