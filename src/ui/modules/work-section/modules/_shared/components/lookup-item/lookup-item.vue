<template>
  <article class="lookup-item">
    <lookup-item-wrapper>
      <template v-if="!noBefore" #before>
        <slot name="before">
          <wt-avatar></wt-avatar>
        </slot>
      </template>
      <template v-if="!noMain" #main>
        <div class="lookup-item__main">
          <div class="lookup-item__main-content">
            <div :class="['lookup-item__title', size, size === 'md' ? 'typo-subtitle-1' : 'typo-subtitle-2']">
              <slot name="title"></slot>
            </div>
            <div :class="['lookup-item__subtitle', size, size === 'md' ? 'typo-body-1' : 'typo-body-2']">
              <slot name="subtitle"></slot>
            </div>
          </div>
          <div
            v-if="$slots['info-title'] || $slots['info-subtitle']"
            class="lookup-item__info-content"
          >
            <div :class="['lookup-item__info-title', size, size === 'md' ? 'typo-body-1' : 'typo-body-2']">
              <slot name="info-title"></slot>
            </div>
            <div :class="['lookup-item__info-subtitle', size, size === 'md' ? 'typo-body-1' : 'typo-body-2']">
              <slot name="info-subtitle"></slot>
            </div>
          </div>
        </div>
      </template>
      <template
        v-if="!noAfter"
        #after="scope"
      >
        <slot
          name="after"
          v-bind="scope"
        ></slot>
      </template>

      <template
        v-if="$slots.expansion"
        #expansion
      >
        <slot name="expansion"></slot>
      </template>
    </lookup-item-wrapper>
  </article>
</template>

<script>
import LookupItemWrapper from './lookup-item-wrapper.vue';

export default {
  name: 'LookupItem',
  components: { LookupItemWrapper },
  props: {
    noBefore: {
      type: Boolean,
      default: false,
    },
    noMain: {
      type: Boolean,
      default: false,
    },
    noAfter: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: ''
    }
  },
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.lookup-item {
  cursor: pointer;
}
.lookup-item__main {
  display: flex;
  gap: var(--spacing-xs);
  min-width: 0;

  .lookup-item__main-content,
  .lookup-item__info-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    flex-grow: 1;
  }

  .lookup-item__info-content {
    text-align: right;
  }

  .lookup-item__title {
    overflow-wrap: anywhere;
  }

  .lookup-item__subtitle {
    overflow-wrap: anywhere;
  }

  .lookup-item__info-title,
  .lookup-item__info-subtitle {
    overflow-wrap: anywhere;
  }
}
</style>
