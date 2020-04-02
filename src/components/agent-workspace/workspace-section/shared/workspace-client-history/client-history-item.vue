<template>
  <div class="ws-worksection__item ws-history-item">
    <img class="ws-worksection__item__pic"
         src="../../../../../assets/agent-workspace/default-avatar.svg"
         alt="client photo">
    <div class="ws-worksection__item__text">
      <div class="flex-wrap">
        <div class="ws-history-item__number">+38 (063) 915-15-12</div>
        <div class="ws-history-item__time">16:16</div>
      </div>
      <div class="flex-wrap">
        <div class="ws-history-item__date">13.02.2020</div>
        <div class="ws-history-item__location">Ukraine</div>
      </div>
    </div>
    <div class="ws-worksection__item__status">
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
    height: 50%; // 2 flex-wraps in text container

    &:first-child {
      align-items: flex-start;
    }

    &:last-child {
      align-items: flex-end;
    }
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


  .ws-worksection__item__status {
    .icon-call-transfer-md {
      stroke: $call-color;
      fill: $call-color;
    }

    .icon-missed-call-md {
      stroke: $disconnect-color;
      fill: $disconnect-color;
    }

    .icon-incoming-call-md {
      stroke: $icons-color;
      fill: $icons-color;
    }
  }
</style>
