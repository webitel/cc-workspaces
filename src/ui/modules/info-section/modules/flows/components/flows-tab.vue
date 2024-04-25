<template>
  <section class="flows">
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
import { computed, ref } from 'vue';
import FlowsAPI from '../api/flows.js';
import FlowButton from './flow-button.vue';

const namespace = 'ui/infoSec/flows';
const agentNamespace = 'ui/infoSec/agentInfo';

const store = useStore();
const isLoaded = ref(false);
const flowsList = ref([]);

const team = computed(() => store.getters['ui/infoSec/agentInfo/AGENT_TEAM']);

async function loadFlowsList(id) {
  const { items } = await FlowsAPI.getLookup({ teamId: id, enabled: true });
  if (items.length) {
    flowsList.value = items;
    isLoaded.value = true;
  }
}

if (team.value.id) loadFlowsList(team.value.id);

</script>

<style lang="scss" scoped>
.flows {
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
      //display: flex;
      //align-items: center;
      flex-grow: 1;
    }
  }

}
</style>
