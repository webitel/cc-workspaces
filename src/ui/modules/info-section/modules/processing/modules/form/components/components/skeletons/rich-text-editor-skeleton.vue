<template>
  <article class="rich-text-editor-skeleton">
    <p class="rich-text-editor-skeleton__line"></p>
    <header class="rich-text-editor-skeleton__header">
      <p class="rich-text-editor-skeleton__line"></p>
    </header>
    <section class="rich-text-editor-skeleton__main">
      <p class="rich-text-editor-skeleton__line"></p>
      <p class="rich-text-editor-skeleton__line"></p>
      <p class="rich-text-editor-skeleton__line"></p>
    </section>
    <footer class="rich-text-editor-skeleton__footer"></footer>
  </article>
</template>

<script>
export default {
	name: 'RichTextEditorSkeleton',
};
</script>

<style lang="scss" scoped>
.rich-text-editor-skeleton {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 200px;
  cursor: progress;
  border-radius: var(--border-radius);
  box-shadow: var(--elevation-4);

  &__header {
    padding: var(--spacing-xs);
    box-shadow: var(--elevation-2);
  }

  &__main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
  }

  &__line {
    position: relative;
    overflow: hidden;
    width: 25%;
    height: 12px;
    border-radius: var(--border-radius);
    background: var(--secondary-color);

    &:nth-child(2n) {
      width: 50%;
      height: 24px;
    }

    &:nth-child(3n) {
      width: 100%;
      height: 48px;
    }

    &:before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      content: '';
      transform: translateX(-100%);
      animation-name: gradient-animation;
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
      opacity: 0.2;
      background: linear-gradient(to right, var(--dp-20-surface-color), var(--dp-16-surface-color));

      @keyframes gradient-animation {
        to {
          transform: translateX(100%);
        }
      }
    }
  }

  &__footer {
    height: var(--spacing-sm);
    box-shadow: var(--elevation-2);
  }
}
</style>
