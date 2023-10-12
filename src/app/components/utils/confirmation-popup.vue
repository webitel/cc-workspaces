<template>
  <wt-popup
    class="confirmation-popup"
    @close="close"
  >
    <template v-slot:title>
      {{ $t('confirmationPopup.title') }}
    </template>
    <template v-slot:main>
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
    <template v-slot:actions>
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
  name: 'confirmation-popup',
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
.confirmation-popup__attention-icon {
  text-align: center;
  line-height: 0;
  margin-bottom: var(--spacing-sm);
}
</style>
