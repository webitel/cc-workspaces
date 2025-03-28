<template>
  <wt-expansion-panel
    :size="props.size"
    collapsed
    class="contact-card-description"
  >
    <template #title>{{ $t('vocabulary.description') }}</template>
    <template #default>
      <div class="contact-card-description__text">
        <p v-if="props.description">
          {{ props.description }}
        </p>
        <div v-else>{{ $t('infoSec.contacts.emptyDescription') }}
        </div>
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
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.contact-card-description__text {
  padding: var(--spacing-xs);
}
</style>
