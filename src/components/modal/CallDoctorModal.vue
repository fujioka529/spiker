<script setup lang="ts">
import { ref } from 'vue'
import { CurrentMeasurement } from '../../types/response-types'
import useMeasurement from '../../composables/net/measurement'

interface Props {
  measurement: CurrentMeasurement
}
const props = defineProps<Props>()

interface Emits {
  (e: 'onCloseClicked', value: null): void
}

const emit = defineEmits<Emits>()

const memo = ref<string>('')

const { closeEvent, closeAnnotation } = useMeasurement()

const onOKClicked = async () => {
  console.log(props.measurement.latestEvent)
  if (props.measurement.latestEvent.type == 'computed') {
    await closeEvent(props.measurement.id, props.measurement.latestEvent.id, memo.value)
  } else {
    await closeAnnotation(
      props.measurement.id,
      props.measurement.latestEvent.id,
      memo.value
    )
  }
  emit('onCloseClicked', null)
}
</script>

<template>
  <div class="modal active">
    <div class="modal__main modal__m">
      <div class="modal__close">
        <a
          href=""
          class="modal__close__btn"
          @click.stop.prevent="emit('onCloseClicked', null)"
          ><i class="fas fa-times"></i
        ></a>
      </div>
      <h2 class="modal__heading">{{ $t('callDoctor') }}</h2>
      <section class="modal__content">
        <form>
          <p>{{ $t('callDoctorFromNow') }}</p>
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
