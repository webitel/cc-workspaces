<template>
  <div class="ws-worksection">
    <search v-model="search"></search>
    <div class="ws-worksection__list">
      <div>
        <div class="ws-worksection__list-separator">Today</div>
        <history-item></history-item>
        <history-item></history-item>
      </div>
      <div>
        <div class="ws-worksection__list-separator">Yesterday</div>
        <history-item></history-item>
        <history-item></history-item>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from '../../../../utils/search-input.vue';
  import HistoryItem from './client-history-item.vue';

  export default {
    name: 'client-history-container',
    components: {
      Search,
      HistoryItem,
    },

    data: () => ({
      search: '',
    }),
  };
</script>

<style lang="scss" scoped>
</style>
