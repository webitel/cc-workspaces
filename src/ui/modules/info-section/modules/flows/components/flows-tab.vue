<template>
  <section class="flows-tab">
    <ul v-if="isLoaded">
      <li
        v-for="(flow) in flowsList"
        :key="flow.id"
        class="flow-item"
      >
        <div class="flow-item__wrapper">
          <span class="flow-item__name">
            {{ flow.name }}
          </span>
          <flow-button :id="flow.id"/>
        </div>
        <wt-divider/>
      </li>
    </ul>
    <wt-dummy
      v-else
      class="flow-item__dummy"
      :text="$t('infoSec.flows.dummy')"
    />
  </section>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref, reactive } from 'vue';
import FlowsAPI from '../api/flows.js';
import FlowButton from './flow-button.vue';

const namespace = 'ui/infoSec/flows';

const store = useStore();
const isLoaded = ref(false);
const flowsList = ref([]);

const teamId = computed(() => store.getters[`${namespace}/AGENT_TEAM`].id);

async function loadFlowsList(teamId) {
  try {
    const { items } = await FlowsAPI.getLookup({ teamId, enabled: true });
    if (items.length) {
      flowsList.value = items;
      isLoaded.value = true;
    }
  } catch (err) {
    throw err;
  }
}

if (teamId.value) loadFlowsList(teamId.value);

</script>

<style lang="scss" scoped>
.flows-tab {
  @extend %wt-scrollbar;

  .flow-item{

    &__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xs);
      gap: var(--spacing-xs);
    }

    &__name {
      @extend %typo-body-1;
      overflow-wrap: break-word;
      word-break: break-all;
      text-transform: capitalize;
    }

    &__dummy {
      flex-grow: 1;
    }
  }

}
</style>
