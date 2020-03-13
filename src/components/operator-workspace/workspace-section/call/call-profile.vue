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
    margin-bottom: calcVH(40px);

    &__pic {
      width: calcVH(90px);
      height: calcVH(90px);
      margin: 0 auto calcVH(20px);
      border-radius: 50%;
    }

    &__name {
      @extend .typo-heading-sm;
      margin-bottom: calcVH(10px);
    }

    &__number {
      @extend .typo-body-md;
    }
  }
</style>
