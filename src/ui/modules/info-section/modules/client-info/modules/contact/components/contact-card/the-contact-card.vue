<template>
  <div class="contact-card">
    <general
      :contact="props.contact"
      :size="props.size"
      :linked="props.linked"
      @link="emit('link')"
    />
    <labels
      :labels="labels"
      :size="props.size"
      :collapsed="!isContactTabsOpen"
    />
    <variables
      :variables="variables"
      :size="props.size"
      :collapsed="!isContactTabsOpen"
    />
    <description
      :description="description"
      :size="props.size"
      :collapsed="!isContactTabsOpen"
    />
    <communications
      :contact="props.contact"
      :size="props.size"
      :linked="props.linked"
      :collapsed="!isContactTabsOpen"
    />
  </div>
</template>
<script setup lang="ts">
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useSystemSettingsStore } from '../../../../../../../../../features/modules/system-settings/store/system-settings';
import Communications from './contact-card-communications.vue';
import Description from './contact-card-description.vue';
import General from './contact-card-general.vue';
import Labels from './contact-card-labels.vue';
import Variables from './contact-card-variables.vue';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		contact: WebitelContactsContact;
		linked?: boolean;
	}>(),
	{
		size: ComponentSize.SM,
		linked: false,
	},
);

const emit = defineEmits<{
	link: [];
}>();

const systemSettingsStore = useSystemSettingsStore();

const isContactTabsOpen = computed(
	() =>
		!!systemSettingsStore.settings[EngineSystemSettingName.ExpandContactTabs],
);

const labels = computed(() => props.contact?.labels?.data);
const variables = computed(() => props.contact?.variables?.data);
const description = computed(() => props.contact?.about);
</script>

<style lang="scss" scoped>
.contact-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
}
</style>
