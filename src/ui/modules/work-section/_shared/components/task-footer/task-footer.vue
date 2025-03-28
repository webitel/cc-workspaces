<template>
  <footer class="task-footer">
    <slot></slot>
  </footer>
</template>

<script>
export default {
  name: 'task-footer',
};
</script>

<style lang="scss" scoped>
.task-footer {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
