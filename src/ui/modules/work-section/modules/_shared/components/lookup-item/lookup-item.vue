<template>
  <article class="lookup-item">
    <lookup-item-wrapper :style="id === activeItemCallHistory && 'border-color: var(--accent-color)'">
      <template slot="before" v-if="!noBefore">
        <slot name="before">
          <wt-avatar></wt-avatar>
        </slot>
      </template>
      <template slot="main" v-if="!noMain">
        <div class="lookup-item__main">
          <div class="lookup-item__main-content">
            <div class="lookup-item__title">
              <slot name="title"></slot>
            </div>
            <div class="lookup-item__subtitle">
              <slot name="subtitle"></slot>
            </div>
          </div>
          <div
            v-if="$slots['info-title'] || $slots['info-subtitle']"
            class="lookup-item__info-content"
          >
            <div class="lookup-item__info-title">
              <slot name="info-title"></slot>
            </div>
            <div class="lookup-item__info-subtitle">
              <slot name="info-subtitle"></slot>
            </div>
          </div>
        </div>
      </template>
      <template slot="after" v-if="!noAfter">
        <slot name="after"></slot>
      </template>
    </lookup-item-wrapper>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import LookupItemWrapper from './lookup-item-wrapper.vue';

export default {
  name: 'lookup-item',
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
    id: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('workspace', {
      activeItemCallHistory: (state) => state.activeItemCallHistory,
    }),
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
    overflow-wrap: anywhere;
  }

  .lookup-item__subtitle {
    @extend %typo-body-2;
    overflow-wrap: anywhere;
  }

  .lookup-item__info-title,
  .lookup-item__info-subtitle {
    @extend %typo-body-2;
    overflow-wrap: anywhere;
  }
}
</style>
