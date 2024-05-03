<template>
  <section class="flows-tab">
    <ul v-if="!isLoaded && flowsList.length">
      <div
        v-for="(flow) in flowsList"
        :key="flow.id"
        class="flows-tab-item-wrapper"
      >
        <li class="flows-tab-item">
          <span class="flows-tab-item__name">
            {{ flow.name }}
          </span>
          <flow-button :item="flow"/>
        </li>
        <wt-divider />
      </div>

    </ul>
    <wt-dummy
      v-else
      class="flows-tab__dummy"
      :text="$t('infoSec.flows.dummy')"
    />
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useCachedInterval } from '@webitel/ui-sdk/src/composables/useCachedInterval/useCachedInterval';
import FlowsAPI from '../api/flows.js';
import FlowButton from './flow-button.vue';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';

const namespace = 'ui/infoSec/flows';

const store = useStore();
const isLoaded = ref(false);

const teamId = computed(() => store.getters[`${namespace}/AGENT_TEAM_ID`]);
const flowsList = computed(() => getNamespacedState(store.state, namespace).flows);

const { subscribe } = useCachedInterval({ timeout: 5 * 1000 });

async function loadFlowsList() {
    try {
     await store.dispatch(`${namespace}/LOAD_FLOWS_LIST`);
    } catch (err) {
      throw err;
    } finally {
      isLoaded.value = false;
    }
}

if (teamId.value) subscribe(loadFlowsList);

</script>

<style lang="scss" scoped>
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
      overflow-wrap: break-word;
      word-break: break-all;
      text-transform: capitalize;
    }
  }

  &__dummy {
    flex-grow: 1;
  }
}
</style>
