<template>
  <section class="flows-tab">
    <ul v-if="flowsList.length">
      <div
        v-for="(flow) in flowsList"
        :key="flow.id"
        class="flows-tab-item-wrapper"
      >
        <li class="flows-tab-item">
          <span class="flows-tab-item__name">
            {{ flow.name }}
          </span>
          <flow-button
class="flow-tab__button"
                       :item="flow"
                       :size="size ? size : 'md'"
                       width-by-content
          />
        </li>
        <wt-divider />
      </div>
    </ul>
  </section>
</template>

<script setup>
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useStore } from 'vuex';

import FlowButton from './flow-button.vue';

const namespace = 'ui/infoSec/flows';

const props = defineProps({
  size: {
    type: String,
    required: false,
  },
});

const store = useStore();

const flowsList = computed(() => getNamespacedState(store.state, namespace).flows);

</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.flows-tab {
  @extend %wt-scrollbar;

  .flows-tab-item-wrapper:last-child hr {
    display: none;
  }

  .flows-tab-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);

    &__name {
      @extend %typo-body-1;
      flex: 1;
      overflow-wrap: break-word;
      word-break: break-all;
    }
  }

  &__dummy {
    flex-grow: 1;
  }
}
</style>
