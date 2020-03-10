<template>
  <div class="call-profile">
    <img class="call-profile__pic" src="../../../../assets/operator-workspace/default-avatar.svg"
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
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: calcRem(40px);

    &__pic {
      width: calcRem(90px);
      height: calcRem(90px);
      margin: 0 auto calcRem(20px);
      border-radius: 50%;
    }

    &__name {
      @extend .typo-heading-sm;
      margin-bottom: calcRem(10px);
    }

    &__number {
      @extend .typo-body-md;
    }

    &__sm {
      margin: 0;

      .call-profile__pic {
        width: calcRem(80px);
        height: calcRem(80px);
        margin: 0 auto calcRem(10px);
        border: none;
      }

      .call-profile__name {
        margin-bottom: calcRem(5px);
      }
    }
  }
</style>
