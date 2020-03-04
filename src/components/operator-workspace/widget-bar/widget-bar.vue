<template>
  <aside class="widget-bar">
    <widget></widget>
    <widget></widget>
    <widget></widget>
    <widget></widget>
    <div class="settings">Settings</div>
  </aside>
</template>

<script>
  import Widget from './widget.vue';

  export default {
    name: 'widget-bar',
    components: {
      Widget,
    },
  };
</script>

<style lang="scss" scoped>
  .widget-bar {
    position: relative;
    display: flex;
    justify-content: center;
    padding: calcRem(14px) calcRem(20px);
    background: #fff;
    border-radius: $border-radius;
  }

  .widget {
    margin: 0 calcRem(31px); // 63px / 2
  }

  .settings {
    @extend .typo-body-md;
    position: absolute;
    right: calcRem(20px);
  }
</style>
