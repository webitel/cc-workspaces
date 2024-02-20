<template>
  <lookup-item-container
    :search="dataSearch"
    :loading="isLoading"
    :empty="!dataList.length"
    @search:input="dataSearch = $event"
    @search:change="resetData"
    @more="handleIntersect"
  >
    <template v-slot:empty>
      <empty-search type="contacts" />
    </template>
    <template v-slot:content>
      <user-lookup-item
        v-for="(item) of dataList"
        :key="item.id"
        :item="item"
        :size="size"
        @input="makeCall({ number: item.extension })"
      ></user-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapActions } from 'vuex';
import infiniteScrollMixin from '../../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import UserLookupItem from '../../../../_shared/components/lookup-item/user-lookup-item.vue';
import EmptySearch from '../../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import APIRepository from '../../../../../../../../app/api/APIRepository';
import LookupItemContainer from '../../../../_shared/components/lookup-item-container/lookup-item-container.vue';

const usersAPI = APIRepository.users;

export default {
  name: 'call-contacts-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    UserLookupItem,
    EmptySearch,
    LookupItemContainer,
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

    fetch: usersAPI.getUsers,
  },
};
</script>

<style lang="scss" scoped>

</style>
