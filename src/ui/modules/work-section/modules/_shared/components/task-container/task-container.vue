<template>
  <section class="task-container">
    <div class="task-container__header-wrapper">
      <slot name="header"></slot>
    </div>
    <div class="task-container__body-wrapper">
      <slot name="body"></slot>
    </div>
    <div class="task-container__footer-wrapper">
      <slot name="footer"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TaskContainer',
};
</script>

<style lang="scss" scoped>
.task-container {
  display: flex;
  flex-direction: column;

  .task-container__body-wrapper {
    flex-grow: 1;
    height: auto;
    min-height: 0;
    padding: var(--spacing-xs) 0;
  }
}
</style>
