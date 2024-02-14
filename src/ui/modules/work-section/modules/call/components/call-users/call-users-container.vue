<template>
  <div class="ws-worksection">
    <wt-search-bar
      v-model="dataSearch"
      @search="resetData"
    ></wt-search-bar>

    <section class="ws-worksection__list" ref="scroll-wrap">

      <wt-loader v-if="isLoading"/>
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
        <user-lookup-item
          v-for="(item) of dataList"
          :key="item.id"
          :item="item"
          :size="size"
          @input="makeCall({ user: $event })"
        ></user-lookup-item>
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
  import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
  import UserLookupItem from '../../../_shared/components/lookup-item/user-lookup-item.vue';
  import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
  import APIRepository from '../../../../../../../app/api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'call-contacts-container',
    mixins: [infiniteScrollMixin, sizeMixin],
    components: {
      UserLookupItem,
      EmptySearch,
    },

    data: () => ({
      dataList: [],
      dataSort: 'presence.status',
      dataFields: ['name', 'id', 'extension', 'presence', 'username'],
    }),

    methods: {
      ...mapActions('features/call', {
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
