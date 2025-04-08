<template>
  <wt-popup
    class="confirmation-popup"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ $t('confirmationPopup.title') }}
    </template>
    <template #main>
      <div class="confirmation-popup__attention-icon">
        <wt-icon
          icon="attention"
          color="error"
        ></wt-icon>
      </div>
      <p class="confirmation-popup__text">
        <slot name="text"></slot>
      </p>
    </template>
    <template #actions>
      <wt-button
        @click="confirm"
      >{{ $t('vocabulary.yes') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ $t('vocabulary.no') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script>
export default {
  name: 'ConfirmationPopup',
  methods: {
    confirm() {
      this.$emit('confirm');
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.confirmation-popup {

  &__attention-icon {
    text-align: center;
    line-height: 0;
    margin-bottom: var(--spacing-sm);
  }
  &__text {
    text-align: center;
  }

}
</style>
