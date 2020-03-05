<template>
  <div class="ws-history-container">
    <search v-model="search"></search>
    <div class="ws-history-wrap">
      <div class="ws-history-date-wrap">
        <div class="ws-history-date">Today</div>
        <history-item></history-item>
        <history-item></history-item>
      </div>
      <div class="ws-history-date-wrap">
        <div class="ws-history-date">Yesterday</div>
        <history-item></history-item>
        <history-item></history-item>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from '../../../utils/search-input.vue';
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
