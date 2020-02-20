<template>
  <aside class="widget-bar">
    <div class="widget">widget 1</div>
    <div class="widget">widget 2</div>
    <div class="widget">widget 3</div>
    <div class="widget">widget 4</div>
    <div class="settings">Settings</div>
  </aside>
</template>

<script>
  export default {
    name: 'widget-bar',
  };
</script>

<style lang="scss" scoped>
  .widget-bar {
    display: flex;
    justify-content: center;
    padding: 14px 20px;
    background: #fff;
    border-radius: $border-radius;
  }

  .widget {
    margin: 0 31px; // 63px / 2
    border: 1px solid red;
  }

  .settings {}
</style>
