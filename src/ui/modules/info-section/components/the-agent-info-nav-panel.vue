<template>
  <nav class="agent-info-nav-panel">
    <wt-tooltip
      v-for="(tab) of tabs"
      :key="tab.value"
    >
      <template v-slot:activator>
        <wt-rounded-action
          :icon="tab.icon || tab.value"
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
import sizeMixin from '../../../../app/mixins/sizeMixin.js';
export default {
  name: 'the-agent-info-section-nav-panel',
  mixins: [sizeMixin],
  props: {
    currentTab: {
      type: Object,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  model: {
    prop: 'currentTab',
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
