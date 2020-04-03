<template>
  <div class="ws-worksection">
    <search
      v-model="search"
      @search="loadDataList"
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
  import { getUsersList } from '../../../../../api/agent-workspace/users/users';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import Contact from './workspace-contact.vue';

  export default {
    name: 'workspace-contacts-container',
    mixins: [infiniteScrollMixin],
    components: {
      Contact,
    },

    data: () => ({
      dataList: [],
      selected: null,
    }),

    methods: {
      select(item) {
        this.selected = item;
      },

      async loadInitialList() {
        this.dataList = await this.loadDataList();
      },

      async loadNext() {
        const response = await this.loadDataList();
        this.dataList = [...this.dataList, ...response];
      },

      async loadDataList() {
        const response = await getUsersList(this.page, this.size, this.search);
        return response;
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
