<template>
  <nav class="agent-info-nav-panel">
    <wt-tooltip
      v-for="(tab) of tabs"
      :key="tab.value"
    >
      <template #activator>
        <wt-rounded-action
          :icon="tab.icon || tab.value"
          :icon-prefix="tab.iconPrefix"
          :active="tab.value === currentTab?.value"
          :size="size"
          rounded
          wide
          @click="$emit('input', tab)"
        ></wt-rounded-action>
      </template>
      {{ tab.text }}
    </wt-tooltip>

  </nav>
</template>

<script>
import sizeMixin from '../../../../../app/mixins/sizeMixin';
export default {
  name: 'TheAgentInfoSectionNavPanel',
  mixins: [sizeMixin],
  model: {
    prop: 'currentTab',
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
};
</script>

<style lang="scss" scoped>
.agent-info-nav-panel {
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: repeat(4, 1fr);
}
</style>
