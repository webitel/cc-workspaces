<template>
  <article class="lookup-item-container">
    <header class="lookup-item-container-header">

      <div class="lookup-item-container-search">
        <!--      pass event handlers as slot scope to prevent re-binding search
 from lookup-item-container wrapper to slotted search -->
        <slot name="search" v-bind="{ search, inputHandler, searchHandler }">
          <wt-search-bar
            :value="search"
            :size="size"
            debounce
            @input="emit('search:input', $event)"
            @search="emit('search:change', $event)"
          ></wt-search-bar>

          <slot name="after-search"></slot>

        </slot>
      </div>

      <p class="lookup-item-container-subtitle">
        <slot name="subtitle"></slot>
      </p>
    </header>
    <section
      class="lookup-item-container-body"
    >
      <wt-replace-transition appear>
        <div
          v-if="showEmpty"
          class="lookup-item-container-empty"
        >
          <slot name="empty" :show="showEmpty"></slot>
        </div>
        <div
          v-else-if="!loading && !showEmpty"
          class="lookup-item-container-content"
        >
          <slot name="content"></slot>
        </div>
      </wt-replace-transition>

      <wt-intersection-observer
        :canLoadMore="true"
        :loading="loading"
        @next="emit('more')"
      />
    </section>

    <footer class="lookup-item-container-footer">
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue';

import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';
import WtIntersectionObserver from '@webitel/ui-sdk/components/wt-intersection-observer/wt-intersection-observer.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  search: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  empty: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'search:input',
  'search:change', // debounced
  'more',
]);

const inputHandler = (event) => emit('search:input', event);
const searchHandler = (event) => emit('search:change', event);
const scrollWrap = ref(null);
const showEmpty = computed(() => !props.loading && props.empty);
</script>

<style scoped lang="scss">
.lookup-item-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  height: 100%;
  gap: var(--spacing-xs);
}

.lookup-item-container-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.lookup-item-container-search {
  display: flex;
  gap: var(--spacing-xs);

  // :deep is used for search bars, passed as slot, cause they do not belong to this scope directly
  :deep(.wt-search-bar) {
    flex-grow: 1;
  }
}

.lookup-item-container-subtitle {
  @extend %typo-subtitle-1;
  text-align: center;
}

.lookup-item-container-body {
  @extend %wt-scrollbar;
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-right: var(--scrollbar-width); // scrollbar offset
}

.lookup-item-container-loader,
.lookup-item-container-empty {
  margin: auto;
}
</style>
