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
import { ConfigurationsAPI } from '@webitel/api-services/api';
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, onMounted, ref } from 'vue';
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

const isContactTabsOpen = ref(false);

const labels = computed(() => props.contact?.labels?.data);
const variables = computed(() => props.contact?.variables?.data);
const description = computed(() => props.contact?.about);

const getValueExpandContactTabsVariable = async () => {
	const { items } = await ConfigurationsAPI.getList({
		name: [
			EngineSystemSettingName.ExpandContactTabs,
		],
	});
	return items?.[0]?.value;
};

onMounted(async () => {
	isContactTabsOpen.value =
		(await getValueExpandContactTabsVariable()) ?? false;
});
</script>

<style lang="scss" scoped>
.contact-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
}
</style>
