<template>
  <section class="flows-tab">
    <wt-loader v-if="isLoading"/>
    <ul v-if="!isLoading && flowsList.length">
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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import FlowsAPI from '../api/flows.js';
import FlowButton from './flow-button.vue';

const namespace = 'ui/infoSec/flows';

const store = useStore();
const isLoading = ref(false);
const flowsList = ref([]);

const teamId = computed(() => store.getters[`${namespace}/AGENT_TEAM`].id);

async function loadFlowsList(teamId) {
    try {
      isLoading.value = true;
      const { items } = await FlowsAPI.getLookup({ teamId, enabled: true });
      flowsList.value = items;
    } catch (err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
}

if (teamId.value) loadFlowsList(teamId.value);

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
