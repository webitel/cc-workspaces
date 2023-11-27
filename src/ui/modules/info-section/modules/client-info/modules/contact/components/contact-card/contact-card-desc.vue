<template>
  <wt-expansion-panel
    :size="props.size"
    class="contact-info-desc"
  >
    <template v-slot:title>{{ $t('vocabulary.description') }}</template>
    <template>
      <div class="contact-info-desc__text">
        {{ props.description }}
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  description: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.contact-info-desc__text {
  padding: var(--spacing-xs);
}
</style>
