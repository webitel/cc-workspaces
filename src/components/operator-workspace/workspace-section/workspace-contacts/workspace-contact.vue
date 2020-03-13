<template>
  <div class="ws-worksection__item ws-contact-item">
    <img
      class="ws-worksection__item__pic"
      src="../../../../assets/operator-workspace/default-avatar.svg"
      alt="user photo">
    <div class="ws-worksection__item__text">
      <div class="flex-wrap">
        <div class="ws-contact-item__name">{{item.name}}</div>
        <div class="ws-contact-item__number">{{item.extension}}</div>
      </div>
    </div>
    <div class="ws-worksection__item__status">
      <div class="ws-contact-item__status__indicator"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'workspace-contact',

    props: {
      item: {
        type: Object,
        default: () => ({
          name: 'Oleg Marchenko',
          extension: '+38 (063) 915-15-12',
        }),
      },
    },
  };
</script>

<style lang="scss" scoped>

  .flex-wrap {
    height: 100%;
    flex-direction: column;
  }

  .ws-contact-item__name {
    @extend .typo-heading-sm;
  }

  .ws-contact-item__number {
    @extend .typo-body-sm;
  }

  .ws-contact-item__status {
    align-self: end;

    &__indicator {
      width: calcVH(14px);
      height: calcVH(14px);
      background: $true-color;
      border-radius: 50%;
    }
  }
</style>
