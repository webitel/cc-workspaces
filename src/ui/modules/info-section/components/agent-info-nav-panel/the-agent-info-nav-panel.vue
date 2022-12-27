<template>
  <nav class="agent-info-nav-panel">
    <nav-panel-tab
      v-for="(tab) of tabs"
      :key="tab.value"
      :icon="tab.icon || tab.value"
      :title="tab.text"
      :active="tab.value === currentTab.value"
      @click="$emit('input', tab)"
    ></nav-panel-tab>
  </nav>
</template>

<script>
import NavPanelTab from './agent-info-nav-panel-tab.vue';

export default {
  name: 'the-agent-info-section-nav-panel',
  props: {
    currentTab: {
      type: Object,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  components: { NavPanelTab },
  model: {
    prop: 'currentTab',
  },
};
</script>

<style lang="scss" scoped>
.agent-info-nav-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--secondary-color);
}
</style>
