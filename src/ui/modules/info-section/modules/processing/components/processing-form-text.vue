<template>
  <article class="processing-form-text">
    <div class="processing-form-text__icon-wrapper">
      <wt-icon
        icon="attention"
        size="sm"
        color="contrast"
      ></wt-icon>
    </div>
    <h4 class="processing-form-text__title">
      {{ label }}
    </h4>
    <p
      class="processing-form-text__content"
      v-html="content"
    ></p>
  </article>
</template>

<script>
import MarkdownIt from 'markdown-it';
import patchMDRender from '../../client-info/components/client-info-markdown/scripts/patchMDRender';

const md = new MarkdownIt({ linkify: true });
patchMDRender(md);

export default {
  name: 'form-text',
  props: {
    initialValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  computed: {
    content() {
      return md.render(this.initialValue);
    },
  },
};
</script>

<style lang="scss" scoped>
$text-semantic-color: #1A90E5;

.processing-form-text {
  position: relative;
  padding: var(--spacing-sm);
  border: 1px dashed $text-semantic-color;
  border-radius: var(--border-radius);

  &__icon-wrapper {
    position: absolute;
    top: 0;
    right: var(--spacing-xs);
    padding: var(--spacing-3xs);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    background: $text-semantic-color;
    line-height: 0;
  }
}
</style>
