<template>
  <div class="ws-worksection chat-transfer-container">
    <div class="ws-worksection__search-wrap">
      <wt-search-bar
        v-model="dataSearch"
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
        rounded
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
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import APIRepository from '../../../../../../../app/api/APIRepository';
import TransferDestination from '../../enums/ChatTransferDestination.enum';
import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';

const usersAPI = APIRepository.users;
const chatplansAPI = APIRepository.chatplans;

export default {
  name: 'chat-transfer-container',
  mixins: [infiniteScrollMixin, sizeMixin],
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
.ws-worksection__search-wrap {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: var(--spacing-xs);
  padding: var(--spacing-xs);
  background-color: var(--secondary-color);

  .ws-worksection__search {
    flex: 1 1 auto;
    width: auto;
    min-width: auto;
    margin: 0;
  }

  .wt-rounded-action, .wt-icon-btn {
    flex: 0 0 auto;
    margin-left: var(--spacing-xs);
  }
}
</style>
