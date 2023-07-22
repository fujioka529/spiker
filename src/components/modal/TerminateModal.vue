<script setup lang="ts">
import { ref } from 'vue'
import { CurrentMeasurement } from '../../types/response-types'
import useMeasurement from '../../composables/net/measurement'
import { terminationOptions } from '../../shared/options'

interface Props {
  measurement: CurrentMeasurement
}
const props = defineProps<Props>()

interface Emits {
  (e: 'onCloseClicked', value: null): void
}
const emit = defineEmits<Emits>()

const maternalOutcome = ref<string>('')
const memo = ref<string>('')

const { closeMeasurement } = useMeasurement()

const onOKClicked = async () => {
  await closeMeasurement(props.measurement.id, maternalOutcome.value, memo.value)
  emit('onCloseClicked', null)
}
</script>

<template>
  <div class="modal active">
    <div class="modal__main modal__l">
      <div class="modal__close">
        <a
          href=""
          class="modal__close__btn"
          @click.stop.prevent="emit('onCloseClicked', null)"
          ><i class="fas fa-times"></i
        ></a>
      </div>
      <h2 class="modal__heading">{{ $t('terminateMonitoring') }}</h2>
      <section class="modal__content">
        <form>
          <p>{{ $t('terminateMeasurement') }}</p>

          <div class="item-box">
            <div class="item">
              <p class="label label-point">{{ $t('maternalOutcome') }}</p>
              <div class="inputs">
                <template v-for="option in terminationOptions" :key="option.label">
                  <input
                    :id="option.label"
                    type="radio"
                    v-model="maternalOutcome"
                    :value="option.value"
                  />
                  <label :for="option.label">{{ $t(option.label) }}</label>
                  <br />
                </template>
              </div>
            </div>
          </div>

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
