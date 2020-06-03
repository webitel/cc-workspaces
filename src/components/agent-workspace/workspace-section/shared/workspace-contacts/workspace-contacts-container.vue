<template>
  <div class="ws-worksection">
    <search
      v-model="search"
      @search="loadInitialList"
    />
    <div class="ws-worksection__list" ref="scroll-wrap">
      <contact
        v-for="(item, key) of dataList"
        :key="key"
        :item="item"
        callable
      ></contact>
      <observer
        :options="obsOptions"
        @intersect="handleIntersect"/>
    </div>
  </div>
</template>

<script>
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import Contact from './workspace-contact.vue';
  import APIRepository from '../../../../../api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'workspace-contacts-container',
    mixins: [infiniteScrollMixin],
    components: {
      Contact,
    },

    data: () => ({
      dataList: [],
      selected: null,
      sort: '!dlg,!dnd,web,sip',
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
      background-color: $page-bg-color;
    }
  }
</style>
