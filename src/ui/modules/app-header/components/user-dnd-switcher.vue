<template>
  <wt-tooltip>
    <template v-slot:activator>
      <wt-switcher
        :label="$t('header.dnd.label')"
        :value="isDnd"
        @change="toggleDnd"
      ></wt-switcher>
    </template>
    {{ $t('header.dnd.tooltip') }}
  </wt-tooltip>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserStatus from '../../../../features/modules/agent-status/statusUtils/UserStatus';

export default {
  name: 'user-dnd-switcher',
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
