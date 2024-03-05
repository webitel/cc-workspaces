<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >

    <template v-slot:after-search>
      <wt-rounded-action
        :class="{ 'active': transferDestination === TransferDestination.CHATPLAN }"
        icon="ws-bot"
        rounded
        :size="size"
        @click="transferDestination = TransferDestination.CHATPLAN"
      ></wt-rounded-action>
      <wt-icon-btn
        icon="close"
        @click="closeTab"
      ></wt-icon-btn>
    </template>

    <template v-slot:empty>
      <empty-search type="contacts" />
    </template>

    <template v-slot:content>
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
        <template v-slot:before>
          <wt-icon
            icon="bot"
            icon-prefix="ws"
          ></wt-icon>
        </template>
      </transfer-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import APIRepository from '../../../../../../../app/api/APIRepository';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import TransferDestination from '../../enums/ChatTransferDestination.enum';
import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';
import botAvatar from '../../../_shared/assets/avatars/bot-avatar.svg';

const usersAPI = APIRepository.users;
const chatplansAPI = APIRepository.chatplans;

export default {
  name: 'chat-transfer-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    LookupItemContainer,
    TransferLookupItem,
    EmptySearch,
  },

  data: () => ({
    dataList: [],
    TransferDestination,
    transferDestination: TransferDestination.CHATPLAN,
    botAvatar,
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
  },
  watch: {
    transferDestination() {
      this.resetData();
    },
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
