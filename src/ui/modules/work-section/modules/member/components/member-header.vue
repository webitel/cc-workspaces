<template>
  <header class="call-header">
    <div class="call-header__actions">
      <div class="actions-wrap actions-wrap__left">
        <wt-rounded-action
          class="call-action"
          :active="isOnHistory"
          icon="history"
          color="secondary"
          rounded
          wide
          @click="$emit('openTab', 'history')"
        ></wt-rounded-action>
      </div>
      <img
        class="call-header__profile-pic"
        src="../../shared/assets/avatars/default-avatar.svg"
        alt="client photo"
      >
      <div class="actions-wrap actions-wrap__right">
        <wt-rounded-action
          :class="{ 'hidden': !isCall }"
          icon="call-ringing"
          color="success"
          rounded
          wide
          @click="makeCall"
        ></wt-rounded-action>
      </div>
    </div>
    <h1 class="call-header__name">{{member.name}}</h1>
  </header>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';

  export default {
    name: 'workspace-member-header',
    props: {
      currentTab: {
        type: String,
      },
    },
    computed: {
      ...mapState('features/member', {
        member: (state) => state.memberOnWorkspace,
      }),
      ...mapGetters('features/member', {
        isCommSelected: 'IS_COMMUNICATION_SELECTED',
      }),

      isOnHistory() {
        return this.currentTab === 'history';
      },

      isCall() {
        return this.isCommSelected;
      },
    },

    methods: {
      ...mapActions('features/member', {
        makeCall: 'CALL',
      }),
    },
  };
</script>

<style lang="scss" scoped>
@import '../../call/css/call-header';
</style>
