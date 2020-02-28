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
    <div class="ws-contact-item__status"></div>
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
</style>
