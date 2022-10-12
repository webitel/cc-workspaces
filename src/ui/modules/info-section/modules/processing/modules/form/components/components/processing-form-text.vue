<template>
  <article
    class="markdown-body processing-form-text"
    :class="[`markdown-body processing-form-text--color-${color}`]"
  >
    <div class="processing-form-text__icon-wrapper">
      <wt-icon
        icon="attention"
        size="sm"
        color="contrast"
      ></wt-icon>
    </div>
    <h4 class="processing-form-text__title">
      {{ label }}

      <wt-hint
        v-if="hint"
      >{{ hint }}</wt-hint>
      <wt-icon-btn
        :icon="rolledUp ? 'arrow-right' : 'arrow-down'"
        @click="handlerFolding"
      ></wt-icon-btn>
    </h4>
    <p
      class="processing-form-text__content"
      v-html="content"
      v-show="rolledUp"
    ></p>
  </article>
</template>

<script>
import MarkdownIt from 'markdown-it';
import patchMDRender from '../../../../../client-info/components/client-info-markdown/scripts/patchMDRender';

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
    hint: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'default',
      options: ['default', 'secondary', 'accent', 'success', 'danger'],
    },
    collapsible: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    rolledUp: true,
  }),
  methods: {
    handlerFolding() {
      this.rolledUp = !this.rolledUp;
    },
  },
  computed: {
    content() {
      return md.render(this.initialValue);
    },
  },
  mounted() {
    this.rolledUp = this.collapsible;
  },
};
</script>

<style lang="scss" scoped>
$default-color: #1A90E5;

.processing-form-text {
  position: relative;
  padding: var(--spacing-sm);
  border: 1px dashed $default-color;
  border-radius: var(--border-radius);

  .processing-form-text__icon-wrapper {
    position: absolute;
    top: 0;
    right: var(--spacing-xs);
    padding: var(--spacing-3xs);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    line-height: 0;
    background: $default-color;
  }

  &--color {
    &-default {
      border-color: $default-color;

      .processing-form-text__icon-wrapper {
        background: $default-color;
      }
    }
    &-secondary {
      border-color: var(--secondary-color);

      .processing-form-text__icon-wrapper {
        background: var(--secondary-color);
      }
    }
    &-accent {
      border-color: var(--accent-color);

      .processing-form-text__icon-wrapper {
        background: var(--accent-color);
      }
    }
    &-success {
      border-color: var(--true-color);

      .processing-form-text__icon-wrapper {
        background: var(--true-color);
      }
    }
    &-danger {
      border-color: var(--false-color);

      .processing-form-text__icon-wrapper {
        background: var(--false-color);
      }
    }
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: var(--spacing-sm);
  }
}

</style>
