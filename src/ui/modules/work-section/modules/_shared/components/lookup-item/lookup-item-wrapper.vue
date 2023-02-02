<template>
  <div class="lookup-item-wrapper">
    <slot>
      <div v-if="$slots.before" class="lookup-item-wrapper__before">
        <slot name="before">
          <wt-avatar></wt-avatar>
        </slot>
      </div>
      <div v-if="$slots.main" class="lookup-item-wrapper__main">
        <slot name="main">
          <div></div>
        </slot>
      </div>
      <div v-if="$slots.after" class="lookup-item-wrapper__after">
        <slot name="after"></slot>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'lookup-item-wrapper',
};
</script>

<style lang="scss" scoped>
.lookup-item-wrapper {
  $min-height: 50px;

  display: flex;
  box-sizing: border-box;
  min-height: $min-height;
  padding: var(--spacing-xs);
  transition: var(--transition);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  gap: var(--spacing-xs);

  &:hover {
    border-color: var(--accent-color);
  }

  &__main {
    flex-grow: 1;
  }
}
</style>
