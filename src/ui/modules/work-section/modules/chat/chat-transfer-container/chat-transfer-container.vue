<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >

    <template #after-search>
      <wt-rounded-action
        :class="{ 'active': transferDestination === TransferDestination.CHATPLAN }"
        icon="bot"
        rounded
        :size="size"
        @click="transferDestination = TransferDestination.CHATPLAN"
      ></wt-rounded-action>
      <wt-icon-btn
        icon="close"
        @click="closeTab"
      ></wt-icon-btn>
    </template>

    <template #empty>
      <empty-search type="contacts" />
    </template>

    <template #content>
      <transfer-lookup-item
        v-for="(item, key) of dataList"
        :key="`${item.id}${key}`"
        :item="item"
        :size="size"
        :src="botAvatar"
        :type="transferDestination"
        @input="handleTransfer"
      >
        <template #before>
          <wt-icon
            icon="bot"
          />
        </template>
      </transfer-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

import APIRepository from '../../../../../../app/api/APIRepository.js';
import useInfiniteScroll from '../../../../../../app/composables/useInfiniteScroll';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';
import botAvatar from '../../_shared/assets/avatars/bot-avatar.svg';
import TransferLookupItem from '../../_shared/components/lookup-item/transfer-lookup-item.vue';
import LookupItemContainer from '../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../_shared/components/workspace-empty-search/components/empty-search.vue';
import TransferDestination from '../enums/ChatTransferDestination.enum.js';

const usersAPI = APIRepository.users;
const chatplansAPI = APIRepository.chatplans;

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const emit = defineEmits(['openTab', 'closeTab']);

const store = useStore();

const transferDestination = ref(TransferDestination.CHATPLAN);
const hotkeyUnsubscribers = ref([]);

const userId = computed(() => store.state['ui/userinfo']?.userId);

const fetchUsers = (params) => {
  const userParams = {
    filters: 'presence.status=sip,!dnd',
    sort: 'presence.status',
    fields: ['name', 'id', 'extension', 'presence'],
  };
  return usersAPI.getUsers({ ...userParams, ...params, notId: [userId.value] });
};

const fetchChatplans = (params) => {
  return chatplansAPI.getChatplans({ ...params, enabled: true });
};

const fetchFn = (params) => {
  if (transferDestination.value === TransferDestination.CHATPLAN) {
    return fetchChatplans(params);
  }
  return fetchUsers(params);
};

const {
  dataList,
  isLoading,
  dataSearch,
  handleIntersect,
  resetData,
} = useInfiniteScroll({
  fetchFn,
  size: 20,
});

const handleTransfer = async (item) => {
  await store.dispatch('features/chat/TRANSFER', {
    destination: transferDestination.value,
    item
  });
  emit('openTab', 'successful-transfer');
};

const closeTab = () => {
  emit('closeTab');
};

const setupHotkeys = () => {
  const subscribers = [
    {
      event: HotkeyAction.TRANSFER,
      callback: closeTab,
    },
  ];
  hotkeyUnsubscribers.value = useHotkeys(subscribers);
};

watch(transferDestination, () => {
  resetData();
});

onMounted(() => {
  setupHotkeys();
});

onUnmounted(() => {
  hotkeyUnsubscribers.value.forEach((unsubscribe) => unsubscribe());
});
</script>

<style lang="scss" scoped>
:deep(.lookup-item-container-search) {
  padding: var(--spacing-xs);
  background-color: var(--dp-18-surface-color);
  border-radius: var(--spacing-xs);
}
</style>
