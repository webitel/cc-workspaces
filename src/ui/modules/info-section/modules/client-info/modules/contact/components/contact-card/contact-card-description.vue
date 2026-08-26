<template>
  <wt-expansion-panel
    :size="props.size"
    :collapsed="props.collapsed"
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

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		description?: string;
		collapsed?: boolean;
	}>(),
);
</script>

<style lang="scss" scoped>
.contact-card-description__text {
  padding: var(--spacing-xs);
}
</style>
