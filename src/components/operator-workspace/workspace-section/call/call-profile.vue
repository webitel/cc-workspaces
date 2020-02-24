<template>
  <div class="call-profile">
    <img class="call-profile__pic" src="https://cs4.pikabu.ru/post_img/2016/05/22/8/1463919617179069423.jpg"
         alt="client photo">
    <div class="call-profile__name">
      Oleg Marchenko
    </div>
    <div class="call-profile__number">
      +38 (063) 915-15-12
    </div>
  </div>
</template>

<script>
  export default {
    name: 'call-profile',
  };
</script>

<style lang="scss" scoped>
  .call-profile {
    text-align: center;
    margin-bottom: 40px;

    &__pic {
      width: 90px;
      height: 90px;
      margin: 0 auto 20px;
      border-radius: 50%;
      border: 1px solid red;
    }

    &__name {
      @extend .typo-heading-sm;
      margin-bottom: 10px;
    }
  }
</style>
