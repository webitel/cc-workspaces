<template>
  <header class="agent-info-section-tab-header">
    <h3 class="agent-info-section-tab-headline">
      <slot></slot>
    </h3>
  </header>
</template>

<script>
export default {
  name: 'the-agent-info-section-tab-header',
};
</script>

<style lang="scss" scoped>
.agent-info-section-tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--secondary-color-50);
  border-radius: var(--border-radius);
}

.agent-info-section-tab-headline {
  @extend %typo-subtitle-1;
}
</style>
