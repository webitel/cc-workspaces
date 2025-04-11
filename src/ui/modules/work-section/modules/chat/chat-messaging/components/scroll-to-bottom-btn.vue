<template>
  <div
    v-if="props.newMessageCount"
    class="scroll-to-bottom-btn"
  >

    <div class="scroll-to-bottom-btn__messages-counter">
      {{ props.newMessageCount }}
    </div>
    <wt-rounded-action
      icon="arrow-down"
      rounded
      @click="emit('scroll')"
    />

  </div>
</template>

<script setup>

const props = defineProps({
  newMessageCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['scroll']);

</script>

<style lang="scss" scoped>

.scroll-to-bottom-btn {
  position: absolute;
  bottom: 0;
  right: calc(var(--scrollbar-width) + var(--spacing-2xs));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xs);

  &__messages-counter {
    @extend %typo-body-2;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--btn-success-color);
    border-radius: 50%;
    color: var(--text-on-brand-color);
  }
}

</style>
