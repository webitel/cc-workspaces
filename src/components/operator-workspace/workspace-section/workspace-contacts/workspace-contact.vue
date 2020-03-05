<template>
  <div class="ws-contact-item">
    <img class="ws-contact-item__pic" src="https://cs4.pikabu.ru/post_img/2016/05/22/8/1463919617179069423.jpg"
         alt="user photo">
    <div class="ws-contact-item__body">
      <div class="flex-wrap">
        <div class="ws-contact-item__name">{{item.name}}</div>
        <div class="ws-contact-item__number">{{item.extension}}</div>
      </div>
    </div>
    <div class="ws-contact-item__status">
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
    align-items: flex-start;
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
      width: 14px;
      height: 14px;
      background: $true-color;
      border-radius: 50%;
    }
  }
</style>
