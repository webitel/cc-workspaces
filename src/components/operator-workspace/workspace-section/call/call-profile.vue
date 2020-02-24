<template>
  <div class="call-profile">
    <img class="call-profile__pic" src="https://cs4.pikabu.ru/post_img/2016/05/22/8/1463919617179069423.jpg"
         alt="client photo">
    <div class="call-profile__name">
      {{getDisplayName}}
    </div>
    <div class="call-profile__number">
      {{getDisplayNumber}}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'call-profile',

    computed: {
      ...mapGetters('operator', {
        getDisplayName: 'GET_CURRENT_ITEM_NAME',
        getDisplayNumber: 'GET_CURRENT_ITEM_NUMBER',
      }),
    },
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
