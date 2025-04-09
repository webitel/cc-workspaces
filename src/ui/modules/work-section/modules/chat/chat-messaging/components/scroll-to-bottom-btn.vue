<template>
  <div v-if="props.newMessages" class="scroll-to-bottom-btn">

    <div class="scroll-to-bottom-btn__messages-counter">
      {{ props.newMessages }}
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
  newMessages: {
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
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3xs);

  &__messages-counter {
    @extend %typo-subtitle-2;///
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-3xs) var(--spacing-xs);///
    background: var(--btn-success-color);
    border-radius: 50%;
    color: white; //!
  }
}

</style>
