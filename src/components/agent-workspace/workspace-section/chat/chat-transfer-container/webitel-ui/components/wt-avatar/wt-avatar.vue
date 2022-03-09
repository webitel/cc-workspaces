<template>
  <div
    class="wt-avatar"
    :class="[`wt-avatar--size-${size}`]"
  >
    <wt-badge
      v-if="badge"
      :color-variable="badgeColorVar"
    ></wt-badge>
    <img
      class="wt-avatar__img"
      src="../../../../../../../../assets/agent-workspace/default-avatar.svg"
      alt="avatar"
    >
  </div>
</template>

<script>
import AbstractUserStatus from '../../enums/AbstractUserStatus.enum';
import WtBadge from '../wt-badge/wt-badge.vue';

export default {
  name: 'wt-avatar',
  components: { WtBadge },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['md'],
    },
    badge: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      options: AbstractUserStatus,
      default: AbstractUserStatus.OFFLINE,
    },
  },
  computed: {
    badgeColorVar() {
      switch (this.status) {
        case AbstractUserStatus.ACTIVE: return 'online-color';
        case AbstractUserStatus.DND: return 'dnd-color';
        case AbstractUserStatus.BUSY: return 'busy-color';
        case AbstractUserStatus.OFFLINE: return 'offline-color';
        default: return 'offline-color';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .wt-avatar {
    --avatar-size--md: 24px;
    --avatar-size: var(--avatar-size--md);

    --online-color: var(--true-color);
    --dnd-color: var(--accent-color);
    --busy-color: var(--false-color);
    --offline-color: var(--secondary-color);

    position: relative;
    width: var(--avatar-size);
    height: var(--avatar-size);

    &__img {
      width: 100%;
      height: 100%;
    }
  }
</style>
