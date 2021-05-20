<template>
  <div class="user-dnd-switcher">
    <wt-switcher
      :value="isDnd"
      :label="$t('header.dnd.label')"
      @change="toggleDnd"
    ></wt-switcher>
    <wt-tooltip nowrap>{{ $t('header.dnd.tooltip') }}</wt-tooltip>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserStatus from '../../../store/modules/agent-status/statusUtils/UserStatus';

export default {
  name: 'user-dnd-switcher',
  computed: {
    ...mapState('status', {
      user: (state) => state.user,
    }),
    isDnd() {
      return this.user.status === UserStatus.DND;
    },
  },
  methods: {
    ...mapActions('status', {
      toggleDnd: 'TOGGLE_USER_DND',
    }),
  },
};
</script>

<style lang="scss" scoped>
.user-dnd-switcher {
  position: relative;

  .wt-tooltip {
    position: absolute;
  }

  &:hover, &:focus-within {
    .wt-tooltip {
      opacity: 1;
    }
  }
}
</style>
