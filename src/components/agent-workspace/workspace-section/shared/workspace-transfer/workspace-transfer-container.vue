<template>
  <div class="ws-worksection">
    <div class="ws-worksection__search-wrap">
      <wt-search-bar
        class="ws-worksection__search"
        v-model="search"
        @search="resetData"
      ></wt-search-bar>
      <wt-button
        color="transfer"
        :disabled="isTransferDisabled"
        @click="transfer"
      >{{$t('transfer.transfer')}}
      </wt-button>
    </div>
    <p class="ws-worksection__list-instruction">{{$t('transfer.selectAgent')}}</p>

    <section class="ws-worksection__list" ref="scroll-wrap">
      <wt-loader v-if="isLoading"/>
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
        <contact
          v-for="(item, key) of dataList"
          :class="{'selected': item === selected}"
          :id="`scroll-item-${key}`"
          :key="key"
          :item="item"
          @click.native="select(item)"
        ></contact>
      </div>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"/>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import Contact from '../workspace-contacts/workspace-contact.vue';
  import EmptySearch from '../workspace-empty-search/empty-search.vue';
  import APIRepository from '../../../../../api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'workspace-transfer-container',
    mixins: [infiniteScrollMixin],
    components: {
      Contact,
      EmptySearch,
    },

    data: () => ({
      dataList: [],
      selected: null,
      filters: 'presence.status=sip,!dnd',
      sort: 'presence.status',
      fields: ['name', 'id', 'extension', 'presence'],
    }),

    computed: {
      ...mapState('userinfo', {
        userId: (state) => state.userId,
      }),
      isTransferDisabled() {
        return !this.selected && !this.search;
      },
    },

    methods: {
      select(item) {
        this.selected = item;
      },

      fetch(params) {
        return usersAPI.getUsers({ ...params, notId: [this.userId] });
      },

      transfer() {
        const number = this.selected
          ? this.selected.extension : this.search;
        this.blindTransfer(number);
      },

      ...mapActions('call', {
        blindTransfer: 'BLIND_TRANSFER',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .ws-worksection__search-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;

    .ws-worksection__search {
      flex: 1 1 auto;
      min-width: auto;
      width: auto;
      margin: 0;
    }

    .wt-button {
      flex: 0 0 auto;
      margin-left: 10px;
    }
  }

  .ws-contact-item {
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    transition: var(--transition);
    cursor: pointer;

    &.selected, &:hover {
      border-color: var(--accent-color);
    }
  }
</style>
