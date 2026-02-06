<template>
  <header
    class="task-header"
    :class="[`task-header--${props.size}`]"
  >
    <div class="task-header-actions">
      <div class="task-header-actions__action-section">
        <slot name="start-section" />
      </div>
      <div class="task-header-actions__action-section">
        <slot name="end-section" />
      </div>
    </div>
    <div class="task-header-info">
      <slot name="info" />
    </div>
  </header>
</template>

<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md';
  }>(),
  {
    size: 'md',
  },
);

</script>

<style scoped>
.task-header-actions {
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-2xs);
}

.task-header-actions__action-section {
  display: flex;
  gap: var(--spacing-2xs);
}

.task-header-actions__action-section:nth-child(2) {
  justify-content: flex-end;
}
</style>
