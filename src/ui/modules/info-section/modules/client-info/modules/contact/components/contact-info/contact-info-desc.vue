<template>
  <wt-expansion-panel
    :size="props.size"
    class="contact-info-desc"
  >
    <template v-slot:title>{{ $t('vocabulary.description') }}</template>
    <template>
      <div class="contact-info-desc__text">
        {{ desc }}
      </div>
    </template>
  </wt-expansion-panel>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
});

const desc = ref('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, ');
</script>

<style lang="scss" scoped>
.contact-info-desc__text {
  padding: var(--spacing-xs);
}
</style>
