<template>
  <nav class="agent-info-nav-panel">
    <wt-button
      v-for="(tab) of tabs"
      :key="tab.value"
      v-tooltip="tab.text"
      :icon="tab.icon || tab.value"
      :icon-prefix="tab.iconPrefix"
			color="secondary"
      :variant="tab.value === currentTab?.value ? 'active' : 'outlined'"
      :size="size"
      rounded
      wide
      @click="$emit('input', tab)"
    />
  </nav>
</template>

<script>
import sizeMixin from '../../../../../app/mixins/sizeMixin';
export default {
	name: 'TheAgentInfoSectionNavPanel',
	mixins: [
		sizeMixin,
	],
	model: {
		prop: 'currentTab',
		event: 'input',
	},
	props: {
		currentTab: {
			type: Object,
		},
		tabs: {
			type: Array,
			default: () => [],
		},
	},
	emits: [
		'input',
	],
};
</script>

<style lang="scss" scoped>
.agent-info-nav-panel {
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: repeat(5, 1fr);
}
</style>
