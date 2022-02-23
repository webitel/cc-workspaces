<template>
  <div class="ws-worksection chat-transfer-container">
    <div class="ws-worksection__search-wrap">
      <wt-search-bar
        v-model="search"
        class="ws-worksection__search"
        @search="resetData"
      />
      <wt-rounded-action
        :class="{ 'active': transferDestination === TransferDestination.USER }"
        color="secondary"
        icon="edit"
        @click="transferDestination = TransferDestination.USER"
      ></wt-rounded-action>
      <wt-rounded-action
        :class="{ 'active': transferDestination === TransferDestination.CHATPLAN }"
        color="secondary"
        icon="edit"
        @click="transferDestination = TransferDestination.CHATPLAN"
      ></wt-rounded-action>
    </div>

    <section ref="scroll-wrap" class="ws-worksection__list">
      <wt-loader v-if="isLoading" />
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
        <contact
          v-for="(item, key) of dataList"
          :id="`scroll-item-${key}`"
          :key="key"
          :class="{'selected': item === selected}"
          :item="item"
          @click.native="select(item)"
        ></contact>
      </div>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"
      />
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import APIRepository from '../../../../../api/APIRepository';
import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
import Contact from '../../shared/workspace-contacts/workspace-contact.vue';
import EmptySearch from '../../shared/workspace-empty-search/empty-search.vue';

const usersAPI = APIRepository.users;
const chatplansAPI = APIRepository.chatplans;

const TransferDestination = Object.freeze({
                                            USER: 'user',
                                            CHATPLAN: 'chatplan',
                                          });

export default {
  name: 'call-transfer-container',
  mixins: [infiniteScrollMixin],
  components: {
    Contact,
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
        fields: ['name', 'id', 'presence'],
      };
      return usersAPI.getUsers({ ...userParams, ...params, notId: [this.userId] });
    },
    fetchChatplans(params) {
      return chatplansAPI.getChatplans(params);
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
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  margin-bottom: 10px;

  .ws-worksection__search {
    flex: 1 1 auto;
    width: auto;
    min-width: auto;
    margin: 0;
  }

  .wt-rounded-action {
    flex: 0 0 auto;
    margin-left: 10px;
  }
}
</style>
