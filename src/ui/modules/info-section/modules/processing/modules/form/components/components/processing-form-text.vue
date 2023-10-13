<template>
  <article
    class="markdown-body processing-form-text"
    :class="[`markdown-body processing-form-text--color-${color}`]"
  >
    <div class="processing-form-text__icon-wrapper">
      <wt-icon
        icon="attention"
        size="sm"
        color="on-dark"
      ></wt-icon>
    </div>
    <h4 class="processing-form-text__title">
      {{ label }}

      <wt-hint
        v-if="hint"
      >{{ hint }}</wt-hint>
      <div class="processing-form-text__actions-wrapper">
        <div class="processing-form-text__copy">
          <wt-copy-action
            :value="initialValue"
            v-show="!collapsed || !collapsible"
            v-if="enableCopying"
          ></wt-copy-action>
        </div>
        <wt-icon-btn
          :icon="collapsed ? 'arrow-right' : 'arrow-down'"
          v-show="collapsible || !collapsed"
          @click="handleCollapse"
        ></wt-icon-btn>
      </div>
    </h4>
    <p
      class="processing-form-text__content"
      v-html="content"
      v-show="!collapsed || !collapsible"
    ></p>
  </article>
</template>

<script>
import MarkdownIt from 'markdown-it';
import patchMDRender from '../../../../../client-info/components/client-info-markdown/scripts/patchMDRender';
import processingFormComponentMixin from '../../mixins/processingFormComponentMixin';
import collapsibleProcessingFormComponentMixin from '../../mixins/collapsibleProcessingFormComponentMixin';

const md = new MarkdownIt({ linkify: true });
patchMDRender(md);

export default {
  name: 'form-text',
  mixins: [processingFormComponentMixin, collapsibleProcessingFormComponentMixin],
  props: {
    color: {
      type: String,
      default: 'default',
      options: ['default', 'secondary', 'accent', 'success', 'danger'],
    },
    enableCopying: {
      type: Boolean,
      default: false,
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
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    line-height: 0;
    background: var(--info-color);
  }

  &--color {
    &-default {
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
    &-accent {
      border-color: var(--primary-color);

      .processing-form-text__icon-wrapper {
        background: var(--primary-color);
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
