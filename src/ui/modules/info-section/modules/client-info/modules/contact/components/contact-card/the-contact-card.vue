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
      :collapsed="expandContactTabs"
    />
    <variables
      :variables="variables"
      :size="props.size"
      :collapsed="expandContactTabs"
    />
    <description
      :description="description"
      :size="props.size"
      :collapsed="expandContactTabs"
    />
    <communications
      :contact="props.contact"
      :size="props.size"
      :linked="props.linked"
      :collapsed="expandContactTabs"
    />
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import ConfigurationAPI from '@webitel/ui-sdk/src/api/clients/configurations/configurations';
import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import Communications from './contact-card-communications.vue';
import Description from './contact-card-description.vue';
import General from './contact-card-general.vue';
import Labels from './contact-card-labels.vue';
import Variables from './contact-card-variables.vue';

const props = defineProps({
	size: {
		type: String,
		default: 'sm',
	},
	contact: {
		type: Object,
		required: true,
	},
	linked: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'link',
]);

const expandContactTabs = ref(false);

const labels = computed(() => props.contact?.labels);
const variables = computed(() => props.contact?.variables);
const description = computed(() => props.contact?.about);

const getValueExpandContactTabsVariable = async () => {
	const { items } = await ConfigurationAPI.getList({
		name: [
			EngineSystemSettingName.ExpandContactTabs,
		],
	});
	return items?.[0]?.value;
};

onMounted(async () => {
	expandContactTabs.value =
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
