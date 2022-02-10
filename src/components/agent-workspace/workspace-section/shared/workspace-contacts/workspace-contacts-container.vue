<template>
  <div class="ws-worksection">
    <wt-search-bar
      v-model="search"
      @search="resetData"
    ></wt-search-bar>

    <section class="ws-worksection__list" ref="scroll-wrap">

      <wt-loader v-if="isLoading"/>
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
        <contact
          v-for="(item) of dataList"
          :key="item.id"
          :item="item"
          callable
        ></contact>
      </div>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"/>
    </section>
  </div>
</template>

<script>
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import Contact from './workspace-contact.vue';
  import EmptySearch from '../workspace-empty-search/empty-search.vue';
  import APIRepository from '../../../../../api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'workspace-contacts-container',
    mixins: [infiniteScrollMixin],
    components: {
      Contact,
      EmptySearch,
    },

    data: () => ({
      dataList: [],
      selected: null,
      sort: 'presence.status',
      fields: ['name', 'id', 'extension', 'presence', 'username'],
    }),

    methods: {
      select(item) {
        this.selected = item;
      },

      fetch(params) {
        return usersAPI.getUsers(params);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .ws-contact-item {
    &:hover {
      background-color: var(--page-bg-color);
    }
  }
</style>
