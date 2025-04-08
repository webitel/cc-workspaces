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
            <div class="lookup-item__title" :class="size">
              <slot name="title"></slot>
            </div>
            <div class="lookup-item__subtitle" :class="size">
              <slot name="subtitle"></slot>
            </div>
          </div>
          <div
            v-if="$slots['info-title'] || $slots['info-subtitle']"
            class="lookup-item__info-content"
          >
            <div class="lookup-item__info-title" :class="size">
              <slot name="info-title"></slot>
            </div>
            <div class="lookup-item__info-subtitle" :class="size">
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
    @extend %typo-subtitle-2;

    &.md{
      @extend %typo-subtitle-1;
    }
    overflow-wrap: anywhere;
  }

  .lookup-item__subtitle {
    @extend %typo-body-2;

    &.md{
      @extend %typo-body-1;
    }
    overflow-wrap: anywhere;
  }

  .lookup-item__info-title,
  .lookup-item__info-subtitle {
    @extend %typo-body-2;
    overflow-wrap: anywhere;

    &.md{
      @extend %typo-body-1;
    }
  }
}
</style>
