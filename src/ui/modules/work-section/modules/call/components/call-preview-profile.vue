<template>
  <div class="preview-profile">
    <img
      class="preview-profile__pic"
      src="../../shared/assets/avatars/default-avatar.svg"
      alt="client photo"
    >
    <div class="preview-profile__name">
      {{ displayName }}
    </div>
    <div class="preview-profile__number">
      {{ displayNumber }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import displayInfoMixin from '../../../../../mixins/displayInfoMixin';

export default {
  name: 'call-preview-profile',
  mixins: [displayInfoMixin],
  computed: {
    ...mapState('features/call', {
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
  margin-bottom: 40px;

  &__pic {
    width: 90px;
    height: 90px;
    margin: 0 auto 20px;
    border-radius: 50%;
  }

  &__name {
    @extend %typo-subtitle-1;
  }

  &__number {
    @extend %typo-body-2;
  }
}
</style>
