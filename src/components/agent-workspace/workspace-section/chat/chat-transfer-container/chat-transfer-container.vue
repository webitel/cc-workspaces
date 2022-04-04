<template>
  <div class="ws-worksection chat-transfer-container">
    <div class="ws-worksection__search-wrap">
      <wt-search-bar
        v-model="search"
        class="ws-worksection__search"
        @search="resetData"
      ></wt-search-bar>

      <wt-rounded-action
        :class="{ 'active': transferDestination === TransferDestination.USER }"
        color="secondary"
        icon="ws-agent"
        @click="transferDestination = TransferDestination.USER"
      ></wt-rounded-action>
      <wt-rounded-action
        :class="{ 'active': transferDestination === TransferDestination.CHATPLAN }"
        color="secondary"
        icon="ws-bot"
        @click="transferDestination = TransferDestination.CHATPLAN"
      ></wt-rounded-action>
      <wt-icon-btn
        icon="close"
        @click="closeTab"
      ></wt-icon-btn>
    </div>

    <section ref="scroll-wrap" class="ws-worksection__list">
      <wt-loader v-if="isLoading" />
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
        <chat-transfer-item
          v-for="(item, key) of dataList"
          :id="`scroll-item-${key}`"
          :key="item.id"
          :item="item"
          :type="transferDestination"
          @transfer="handleTransfer"
        ></chat-transfer-item>
      </div>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"
      />
    </section>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import APIRepository from '../../../../../api/APIRepository';
import TransferDestination from '../../../../../enums/ChatTransferDestination.enum';
import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
import EmptyWorkspaceTransfer from '../../empty-workspace/empty-workspace-transfer.vue';
import EmptySearch from '../../shared/workspace-empty-search/empty-search.vue';
import ChatTransferItem from './chat-transfer-item.vue';

const usersAPI = APIRepository.users;
const chatplansAPI = APIRepository.chatplans;

export default {
  name: 'call-transfer-container',
  mixins: [infiniteScrollMixin],
  components: {
    ChatTransferItem,
    EmptySearch,
  },

  data: () => ({
    dataList: [],
    TransferDestination,
    transferDestination: TransferDestination.USER,
  }),

  computed: {
    ...mapState('userinfo', {
      userId: (state) => state.userId,
    }),
  },

  methods: {
    ...mapActions('chat', {
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
      return chatplansAPI.getChatplans(params);
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
.ws-worksection__search-wrap {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 10px;
  padding: 0 10px;

  .ws-worksection__search {
    flex: 1 1 auto;
    width: auto;
    min-width: auto;
    margin: 0;
  }

  .wt-rounded-action, .wt-icon-btn {
    flex: 0 0 auto;
    margin-left: 10px;
  }
}
</style>
