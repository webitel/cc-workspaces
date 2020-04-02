<template>
  <header class="call-header">
    <div class="call-header__actions">
      <div class="actions-wrap actions-wrap__left">

        <rounded-action
          class="call-action secondary"
          :class="{
            'active': isOnHistory
            }"
          @click.native="$emit('openTab', 'history')"
        >
          <icon>
            <svg class="icon icon-call-history-md md">
              <use xlink:href="#icon-call-history-md"></use>
            </svg>
          </icon>
        </rounded-action>
      </div>
      <img
        class="call-header__profile-pic"
        src="../../../../assets/agent-workspace/default-avatar.svg"
        alt="client photo"
      >
      <div class="actions-wrap actions-wrap__right">
        <rounded-action
          v-if="isCall"
          class="call-action call"
          @click.native="makeCall"
        >
          <icon>
            <svg class="icon icon-call-ringing-md md">
              <use xlink:href="#icon-call-ringing-md"></use>
            </svg>
          </icon>
        </rounded-action>
      </div>
    </div>
    <h1 class="call-header__name">Client name</h1>
  </header>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'workspace-member-header',
    components: {
      RoundedAction,
    },

    props: {
      currentTab: {
        type: String,
      },
    },

    computed: {
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
    justify-content: space-between;
    align-items: stretch;
    margin: 0 0 calcVH(50px);
  }

  .call-header__actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;

    .actions-wrap__left {
      display: flex;
      flex: 0 0 calcVH(190px); // x3 icons 50px + x2 margins 20px

      .call-action {
        margin-right: calcVH(20px);

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .call-header__profile-pic {
      flex: 0 0 calcVH(80px);
      width: calcVH(80px);
      height: calcVH(80px);
    }

    .actions-wrap__right {
      display: flex;
      flex: 0 0 calcVH(190px); // x3 icons 50px + x2 margins 20px
      justify-content: flex-end;

      .call-action {
        margin-left: calcVH(20px);

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .call-header__name {
    @extend .typo-heading-sm;
    text-align: center;
    margin-top: calcVH(10px);
  }
</style>
