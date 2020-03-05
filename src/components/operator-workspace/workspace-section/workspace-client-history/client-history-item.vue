<template>
  <div class="ws-history-item">
    <img class="ws-history-item__pic" src="https://cs4.pikabu.ru/post_img/2016/05/22/8/1463919617179069423.jpg"
         alt="client photo">
    <div class="ws-history-item__body">
      <div class="flex-wrap">
        <div class="ws-history-item__number">+38 (063) 915-15-12</div>
        <div class="ws-history-item__time">16:16</div>
      </div>
      <div class="flex-wrap">
        <div class="ws-history-item__date">13.02.2020</div>
        <div class="ws-history-item__location">Ukraine</div>
      </div>
    </div>
    <div class="ws-history-item__status">
      <icon>
        <svg class="icon icon-missed-call-md md">
          <use xlink:href="#icon-missed-call-md"></use>
        </svg>
      </icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'client-history-item',
  };
</script>

<style lang="scss" scoped>
  .flex-wrap {
    align-items: center;
  }

  .ws-history-item__number {
    @extend .typo-heading-sm;
  }

  .ws-history-item__time {
    @extend .typo-body-md;
  }

  .ws-history-item__date {
    @extend .typo-body-sm;
  }

  .ws-history-item__location {
    @extend .typo-body-sm;
  }
</style>
