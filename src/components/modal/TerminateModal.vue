<script setup lang="ts">
import { ref } from "vue";
import { CurrentMeasurement } from "../../types/response-types";
import useMeasurement from "../../composables/net/measurement";

interface Props {
  measurement: CurrentMeasurement;
}
const props = defineProps<Props>();

interface Emits {
  (e: "onCloseClicked", value: null): void;
}

const emit = defineEmits<Emits>();

const memo = ref<string>("");

const { closeMeasurement } = useMeasurement();

const onOKClicked = async () => {
  await closeMeasurement(props.measurement.id, memo.value);
  emit("onCloseClicked", null);
};
</script>

<template>
  <div class="modal active">
    <div class="modal__main modal__m">
      <div class="modal__close">
        <a href="" class="modal__close__btn"
          ><i class="fas fa-times" @click.stop.prevent="emit('onCloseClicked', null)"></i
        ></a>
      </div>
      <h2 class="modal__heading">{{ $t("Confirm") }}</h2>
      <section class="modal__content">
        <form>
          <p>{{ $t("terminateMeasurement") }}</p>
          <div class="item-row">
            <div class="item">
              <div class="inputs">
                <div class="inputs">
                  <textarea placeholder="memo" v-model="memo"></textarea>
                </div>
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
            <button type="button" class="modal-btn__submit" @click="onOKClicked">
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
