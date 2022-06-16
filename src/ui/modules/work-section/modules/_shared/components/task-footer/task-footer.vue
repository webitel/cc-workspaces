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
  gap: 10px;
  padding: 10px;
}
</style>
