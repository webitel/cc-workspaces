<template>
  <wt-switcher
    v-tooltip="$t('header.dnd.tooltip')"
    :label="$t('header.dnd.label')"
    :value="isDnd"
    @change="toggleDnd"
  ></wt-switcher>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import UserStatus from '../../../../features/modules/agent-status/statusUtils/UserStatus';

export default {
  name: 'UserDndSwitcher',
  computed: {
    ...mapState('features/status', {
      user: (state) => state.user,
    }),
    isDnd() {
      return this.user.status?.[UserStatus.DND];
    },
  },
  methods: {
    ...mapActions('features/status', {
      toggleDnd: 'TOGGLE_USER_DND',
    }),
  },
};
</script>

<style lang="scss" scoped>

</style>
