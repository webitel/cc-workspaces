<template>
  <div class="ws-worksection chat-transfer-container">
    <div class="ws-worksection__search-wrap">
      <wt-search-bar
        v-model="search"
        class="ws-worksection__search"
        debounce
        @search="resetData"
      ></wt-search-bar>

<!--      <wt-rounded-action-->
<!--        :class="{ 'active': transferDestination === TransferDestination.USER }"-->
<!--        color="secondary"-->
<!--        icon="ws-agent"-->
<!--        @click="transferDestination = TransferDestination.USER"-->
<!--      ></wt-rounded-action>-->
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
        <transfer-lookup-item
          v-for="(item, key) of dataList"
          :id="`scroll-item-${key}`"
          :key="`${item.id}${key}`"
          :item="item"
          :type="transferDestination"
          @input="handleTransfer"
        ></transfer-lookup-item>
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
import APIRepository from '../../../../../../../app/api/APIRepository';
import TransferDestination from '../../enums/ChatTransferDestination.enum';
import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
import EmptySearch from '../../../shared/components/workspace-empty-search/components/empty-search.vue';
import TransferLookupItem from '../../../shared/components/lookup-item/transfer-lookup-item.vue';

const usersAPI = APIRepository.users;
const chatplansAPI = APIRepository.chatplans;

export default {
  name: 'call-transfer-container',
  mixins: [infiniteScrollMixin],
  components: {
    TransferLookupItem,
    EmptySearch,
  },

  data: () => ({
    dataList: [],
    TransferDestination,
    transferDestination: TransferDestination.CHATPLAN,
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
