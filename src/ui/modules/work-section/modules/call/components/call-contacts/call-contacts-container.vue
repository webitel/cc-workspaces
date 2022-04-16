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
        <contact-lookup-item
          v-for="(item) of dataList"
          :key="item.id"
          :item="item"
          @input="makeCall({ user: $event })"
        ></contact-lookup-item>
      </div>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"/>
    </section>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
  import ContactLookupItem from '../../../shared/components/lookup-item/contact-lookup-item.vue';
  import EmptySearch from '../../../shared/components/workspace-empty-search/components/empty-search.vue';
  import APIRepository from '../../../../../../../app/api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'call-contacts-container',
    mixins: [infiniteScrollMixin],
    components: {
      ContactLookupItem,
      EmptySearch,
    },

    data: () => ({
      dataList: [],
      sort: 'presence.status',
      fields: ['name', 'id', 'extension', 'presence', 'username'],
    }),

    methods: {
      ...mapActions('call', {
        makeCall: 'CALL',
      }),

      fetch(params) {
        return usersAPI.getUsers(params);
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
