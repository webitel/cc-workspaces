<template>
  <div class="preview-profile">
    <img
      class="preview-profile__pic"
      src="../../../../assets/agent-workspace/default-avatar.svg"
      alt="client photo"
    >
    <div class="preview-profile__name">
      {{displayName}}
    </div>
    <div class="preview-profile__number">
      {{displayNumber}}
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import dispayInfoMixin from '../../../../mixins/displayInfoMixin';

  export default {
    name: 'call-preview-profile',
    mixins: [dispayInfoMixin],

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .preview-profile {
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
