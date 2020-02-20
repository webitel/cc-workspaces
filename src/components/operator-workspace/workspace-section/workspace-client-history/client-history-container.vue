<template>
  <div class="ws-history-container">
    <form class="search-wrap">
      <input class="search" type="text">
    </form>
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
  import HistoryItem from './client-history-item.vue';

  export default {
    name: 'client-history-container',
    components: {
      HistoryItem,
    },
  };
</script>

<style lang="scss" scoped>
</style>
