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
        :id="`scroll-item-${key}`"
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

<script>
import { mapActions, mapState } from 'vuex';

import APIRepository from '../../../../../../app/api/APIRepository.js';
import infiniteScrollMixin from '../../../../../../app/mixins/infiniteScrollMixin.js';
import sizeMixin from '../../../../../../app/mixins/sizeMixin.js';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';
import botAvatar from '../../_shared/assets/avatars/bot-avatar.svg';
import TransferLookupItem from '../../_shared/components/lookup-item/transfer-lookup-item.vue';
import LookupItemContainer from '../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../_shared/components/workspace-empty-search/components/empty-search.vue';
import TransferDestination from '../enums/ChatTransferDestination.enum.js';

const usersAPI = APIRepository.users;
const chatplansAPI = APIRepository.chatplans;

export default {
  name: 'ChatTransferContainer',
  components: {
    LookupItemContainer,
    TransferLookupItem,
    EmptySearch,
  },
  mixins: [infiniteScrollMixin, sizeMixin],

  data: () => ({
    dataList: [],
    TransferDestination,
    transferDestination: TransferDestination.CHATPLAN,
    botAvatar,
    hotkeyUnsubscribers : [],
  }),

  computed: {
    ...mapState('ui/userinfo', {
      userId: (state) => state.userId,
    }),
  },

  methods: {
    ...mapActions('features/chat', {
      transfer: 'TRANSFER',
    }),
    async handleTransfer(item) {
      await this.transfer({ destination: this.transferDestination, item });
      this.$emit('openTab', 'successful-transfer');
    },
    fetch(params) {
      if (this.transferDestination === TransferDestination.CHATPLAN) {
        return this.fetchChatplans(params);
      }
      return this.fetchUsers(params);
    },
    fetchUsers(params) {
      const userParams = {
        filters: 'presence.status=sip,!dnd',
        sort: 'presence.status',
        fields: ['name', 'id', 'extension', 'presence'],
      };
      return usersAPI.getUsers({ ...userParams, ...params, notId: [this.userId] });
    },
    fetchChatplans(params) {
      return chatplansAPI.getChatplans({ ...params, enabled: true });
    },
    closeTab() {
      this.$emit('closeTab');
    },
    setupHotkeys() {
      const subscribers = [
        {
          event: HotkeyAction.TRANSFER,
          callback: this.closeTab,
        },
      ];
      this.hotkeyUnsubscribers  = useHotkeys(subscribers);
    },
  },
  watch: {
    transferDestination() {
      this.resetData();
    },
  },
  mounted() {
    this.setupHotkeys();
  },

  unmounted() {
    this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());
  },
};
</script>

<style lang="scss" scoped>
:deep(.lookup-item-container-search) {
  padding: var(--spacing-xs);
  background-color: var(--dp-18-surface-color);
  border-radius: var(--spacing-xs);
}
</style>
