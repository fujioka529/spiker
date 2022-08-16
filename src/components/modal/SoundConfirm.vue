<script setup lang="ts">
interface Emits {
  (e: "onOKClicked", value: null): void;
}

const emit = defineEmits<Emits>();
</script>

<template>
  <div class="modal active">
    <div class="modal__main modal__sm">
      <h2 class="modal__heading">{{ $t("Confirm") }}</h2>
      <section class="modal__content">
        <div class="dialog__text">
          <p>
            {{ $t("Spiker CTG Alert Monitor make a sound when patients become danger.") }}
          </p>
        </div>
      </section>
      <div class="modal__bottom modal__bottom__center">
        <button
          type="button"
          class="modal-btn__submit"
          @click="emit('onOKClicked', null)"
        >
          OK
        </button>
      </div>
      <!-- // .modal__bottom -->
    </div>
    <!-- // .modal-main -->
  </div>
  <!-- /.modal -->
  <div id="modal-overlay" class="active"></div>
</template>
