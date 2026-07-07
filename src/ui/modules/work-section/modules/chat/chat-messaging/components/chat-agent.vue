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
      <wt-avatar size="xs" :username="firstAgentName"/>
      <p> {{ $t('workspaceSec.chat.chatsAgent', { agentName: firstAgentName }) }} </p>
    </div>
  </article>
</template>

<script setup>
import { WtPopover } from '@webitel/ui-sdk/components';
import { contactChatMessagesHistory } from '@webitel/ui-sdk/src/api/clients/сontacts/index';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useUserinfoStore } from '../../../../../userinfo/userinfoStore';

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
const userinfoStore = useUserinfoStore();
const { userInfo } = storeToRefs(userinfoStore);

const isAgent = (member) =>
	member?.type === 'webitel' || member?.type === 'user';

const currentChat = computed(
	() => store.getters[`${chatNamespace}/CHAT_ON_WORKSPACE`],
);

const liveAgents = computed(() =>
	(currentChat.value?.members ?? []).filter(isAgent),
);

const historyAgents = ref([]);

const agents = computed(() =>
	props.chatId ? historyAgents.value : liveAgents.value,
);
const firstAgentName = computed(
	() => userInfo.value.chatName || agents.value[0]?.name,
);
const hiddenAgents = computed(() => agents.value.slice(1));

watch(
	() => [
		props.chatId,
		props.contactId,
	],
	async ([chatId, contactId]) => {
		if (!chatId || !contactId) {
			historyAgents.value = [];
			return;
		}
		try {
			const { peers } = await contactChatMessagesHistory.getChat({
				contactId,
				chatId,
			});
			historyAgents.value = (peers ?? []).filter(isAgent);
		} catch (err) {
			console.error("Can't get peers from chat. Error:", err);
			historyAgents.value = [];
		}
	},
	{
		immediate: true,
	},
);
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
