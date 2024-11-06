<template>
  <article
    :class="[`markdown-body processing-form-text--color-${color}`]"
    class="markdown-body processing-form-text"
  >
    <div class="processing-form-text__icon-wrapper">
      <wt-icon
        color="on-dark"
        icon="attention"
        size="sm"
      ></wt-icon>
    </div>
    <h4 class="processing-form-text__title">
      {{ label }}

      <wt-hint
        v-if="hint"
      >{{ hint }}
      </wt-hint>
      <div class="processing-form-text__actions-wrapper">
        <div class="processing-form-text__copy">
          <wt-copy-action
            v-if="enableCopying"
            v-show="!collapsed || !collapsible"
            :value="valueToCopy"
          ></wt-copy-action>
        </div>
        <wt-icon-btn
          v-show="collapsible || !collapsed"
          :icon="collapsed ? 'arrow-right' : 'arrow-down'"
          @click="handleCollapse"
        ></wt-icon-btn>
      </div>
    </h4>
    <p
      v-show="!collapsed || !collapsible"
      class="processing-form-text__content"
      v-html="content"
    ></p>
  </article>
</template>

<script>
import markdownit from 'markdown-it';
import patchMDRender from '../../../../../client-info/components/client-info-markdown/scripts/patchMDRender';
import collapsibleProcessingFormComponentMixin from '../../mixins/collapsibleProcessingFormComponentMixin';
import processingFormComponentMixin from '../../mixins/processingFormComponentMixin';

const md = markdownit({
  linkify: true,
  html: true,
});

patchMDRender(md);

export default {
  name: 'form-text',
  mixins: [processingFormComponentMixin, collapsibleProcessingFormComponentMixin],
  props: {
    color: {
      type: String,
      default: 'info',
      options: ['info', 'secondary', 'primary', 'success', 'error'],
    },
    enableCopying: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    content: '',
  }),
  computed: {
    valueToCopy() {
      return this.initialValue.replace(/<br\s*\/?>/gi, '\n');
    },
  },
  watch: {
    initialValue: {
      immediate: true,
      handler(value) {
        if (value) {
          this.content = md.render(value);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.processing-form-text {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) var(--spacing-sm);
  border: 1px dashed var(--info-color);
  border-radius: var(--border-radius);

  .processing-form-text__icon-wrapper {
    position: absolute;
    top: 0;
    right: var(--spacing-xs);
    padding: var(--spacing-3xs);
    line-height: 0;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    background: var(--info-color);
  }

  &--color {
    &-default, // deprecated, remove me in 2025
    &-info { // new name
      border-color: var(--info-color);

      .processing-form-text__icon-wrapper {
        background: var(--info-color);
      }
    }

    &-secondary {
      border-color: var(--secondary-color);

      .processing-form-text__icon-wrapper {
        background: var(--secondary-color);
      }
    }

    &-accent, // deprecated, remove me in 2025
    &-primary { // new name
      border-color: var(--primary-color);

      .processing-form-text__icon-wrapper {
        background: var(--primary-color);
      }
    }

    &-success {
      border-color: var(--success-color);

      .processing-form-text__icon-wrapper {
        background: var(--success-color);
      }
    }

    &-danger, // deprecated, remove me in 2025
    &-error { // new name
      border-color: var(--error-color);

      .processing-form-text__icon-wrapper {
        background: var(--error-color);
      }
    }
  }

  &__title {
    display: flex;
    align-items: center;
    margin-right: var(--spacing-sm);
  }

  &__actions-wrapper {
    display: flex;
    margin-left: auto;

    &__copy {
      margin-right: var(--spacing-xs);
    }
  }
}

</style>
