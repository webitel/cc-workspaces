<template>
  <div class="ws-worksection">
    <div class="ws-worksection__search-wrap">
      <search
        class="ws-worksection__search"
        v-model="search"
        @search="resetData"
      />
      <btn
        class="transfer"
        :class="{'disabled': isTransferDisabled}"
        @click.native="transfer"
      >{{$t('transfer.transfer')}}
      </btn>
    </div>
    <p class="ws-worksection__list-instruction">{{$t('transfer.selectAgent')}}</p>

    <section class="ws-worksection__list" ref="scroll-wrap">
      <loader v-if="isLoading"/>
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
  import { mapActions } from 'vuex';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import Btn from '../../../../utils/btn.vue';
  import Contact from '../workspace-contacts/workspace-contact.vue';
  import EmptySearch from '../workspace-empty-search/empty-search.vue';
  import Loader from '../../../../utils/loader.vue';
  import APIRepository from '../../../../../api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'workspace-transfer-container',
    mixins: [infiniteScrollMixin],
    components: {
      Btn,
      Contact,
      EmptySearch,
      Loader,
    },

    data: () => ({
      dataList: [],
      selected: null,
      filters: 'presence.status=sip,!dnd',
      sort: 'presence.status',
      fields: ['name', 'id', 'extension', 'presence'],
    }),

    computed: {
      isTransferDisabled() {
        return !this.selected && !this.search;
      },
    },

    methods: {
      select(item) {
        this.selected = item;
      },

      fetch(params) {
        return usersAPI.getUsers(params);
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

    .cc-btn {
      flex: 0 0 auto;
      display: block;
      margin-left: 10px;
    }
  }

  .ws-contact-item {
    border: 1px solid transparent;
    border-radius: $border-radius;
    transition: $transition;
    cursor: pointer;

    &.selected, &:hover {
      border-color: $accent-color;
    }
  }
</style>
