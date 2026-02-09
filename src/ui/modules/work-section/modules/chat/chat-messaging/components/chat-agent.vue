<template>
  <article v-if="agents.length" class="chat-agent typo-caption">
      <div v-if="agents.length > 1" class="chat-agent-content">
        <p>
          {{ $t('workspaceSec.chat.chatsAgentsList', { agentName: firstAgentName }) }}
        </p>

        <wt-popover>
          <template #activator="{ show, hide }">
            <div @pointerenter="show" @pointerleave="hide">
              <wt-chip class="chat-agent-content__activator">
                +{{ agents.length - 1 }}
              </wt-chip>
            </div>
          </template>

          <ul>
            <li
              v-for="(agent) of hiddenAgents"
              :key="agent.id"
              class="chat-agent-content__item typo-body-1"
            >
              {{ agent.name }}
            </li>
          </ul>
        </wt-popover>
      </div>

    <div v-else class="chat-agent-content">
      <wt-avatar size="xs" />
      <p> {{ $t('workspaceSec.chat.chatsAgent', { agentName: firstAgentName }) }} </p>
    </div>
  </article>
</template>

<script setup>

import { contactChatMessagesHistory } from '@webitel/ui-sdk/src/api/clients/сontacts/index.js';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { getMessageMember } from '../../../../../../../features/modules/chat/scripts/formatChatMessages.js';

const props = defineProps({
  chatId: {
    type: String,
    default: '',
  },
  contactId: {
    type: String,
    default: '',
  },
});

const store = useStore();
const chatNamespace = 'features/chat';
const agents = ref([]);

const firstAgentName = computed(() => agents.value[0]?.name);
const hiddenAgents = computed(() => agents.value.slice(1));
const currentAgent = computed(() => store.state.ui.infoSec.agentInfo.agent);

const currentChat = computed(() => store.getters[`${chatNamespace}/CHAT_ON_WORKSPACE`]);

const currentChatAgents = computed(() => {
  return currentChat.value?.members?.length > 1
    ? getAgentsFromMembers(currentChat.value?.members)
    : [currentAgent.value];
});

const getAgentsFromMembers = (array) => {
  return array.filter((item) => item.type === 'webitel');
};

const getPeersFromAPI = async (chatId) => { // get all chat participants
  try {
    const { peers } = await contactChatMessagesHistory.getChat({
      contactId: props.contactId,
      chatId,
    });
    return peers;

  } catch (error) {
    console.log('Can`t get peers from chat. Error:', error);
  }
};

const getChatHistoryAgents = async (chatId) => {
  let agents = [];
  const peers = await getPeersFromAPI(chatId);

  if (peers) {
    const members = peers.map((item) => getMessageMember(item)); // formatting objects from API
    agents = getAgentsFromMembers(members); // get only agents
  }

  return { chatHistoryAgents: agents };
}

const setAgentsArray = async () => {
  if (props.chatId) {
    const { chatHistoryAgents } = await getChatHistoryAgents(props.chatId);
    agents.value = chatHistoryAgents;
  } else {
    agents.value = currentChatAgents.value;
  }
}

onMounted(() => {
  setAgentsArray();
});

// Watch for currentChat changes to update agents
watch(currentChat, () => {
  setAgentsArray();
}, { deep: true });

</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-agent {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xs);
}

.chat-agent-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xs);

  &__activator {
    background: var(--secondary-light-color);
    color: var(--secondary-on-color);
    cursor: pointer;
  }

}
</style>
