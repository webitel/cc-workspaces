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
        src="../../../../assets/agent-workspace/default-avatar.svg"
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
      ...mapState('member', {
        member: (state) => state.memberOnWorkspace,
      }),
      ...mapGetters('member', {
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
      ...mapActions('member', {
        makeCall: 'CALL',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .call-header {
    display: flex;
    flex-direction: column;
    margin: 0 0 50px;
  }

  .call-header__actions {
    display: flex;
    justify-content: space-between;

    .actions-wrap {
      display: flex;
      // flex: 0 0 190px; // x3 icons 50px + x2 margins 20px

      &__right {
        justify-content: flex-end;
      }
    }

    .call-header__profile-pic {
      width: 80px;
      height: 80px;
    }
  }

  .call-header__name {
    @extend %typo-subtitle-1;
    text-align: center;
    margin-top: 10px;
  }
</style>
