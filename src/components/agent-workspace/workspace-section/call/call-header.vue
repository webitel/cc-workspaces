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
        <rounded-action
          class="call-action secondary"
          :class="{
            'active': isOnContacts
          }"
          @click.native="$emit('openTab', 'contacts')"
        >
          <icon>
            <svg class="icon icon-call-contacts-md md">
              <use xlink:href="#icon-call-contacts-md"></use>
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
          v-if="isBridge"
          class="call-action secondary bridge"
          :class="{
            'active': isOnBridge
          }"
          @click.native="$emit('openTab', 'bridge')"
        >
          <icon>
            <svg class="icon icon-call-merge-md md">
              <use xlink:href="#icon-call-merge-md"></use>
            </svg>
          </icon>
        </rounded-action>
        <rounded-action
          v-if="isTransfer"
          class="call-action transfer"
          @click.native="$emit('openTab', 'transfer')"
        >
          <icon>
            <svg class="icon icon-call-transfer-md md">
              <use xlink:href="#icon-call-transfer-md"></use>
            </svg>
          </icon>
        </rounded-action>
        <rounded-action
          v-if="isHangup"
          class="call-action end"
          @click.native="hangup"
        >
          <icon>
            <svg class="icon icon-call-end-md md">
              <use xlink:href="#icon-call-end-md"></use>
            </svg>
          </icon>
        </rounded-action>

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

    <div class="call-header__number">
      <div v-if="!isNumberInput">
        <div class="call-profile__name">
          {{displayName}}
        </div>
        <div class="call-profile__number">
          {{displayNumber}}
        </div>
      </div>
      <form
        v-else
        class="call-header__form-number"
        @submit.prevent="makeCall"
      >
        <input
          ref="number-input"
          class="call-header__form-number__input"
          v-model="number"
          type="text"
        >
        <button
          class="icon-btn"
          :class="{'hidden': !number}"
          type="reset"
          @click.prevent="number = ''"
        >
          <icon>
            <svg class="icon icon-close-md md">
              <use xlink:href="#icon-close-md"></use>
            </svg>
          </icon>
        </button>
      </form>
    </div>
    <divider />
  </header>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
  import { CallActions } from 'webitel-sdk';
  import Divider from '../../../utils/divider.vue';
  import RoundedAction from '../../../utils/rounded-action.vue';
  import dispayInfoMixin from '../../../../mixins/displayInfoMixin';

  export default {
    name: 'call-header',
    mixins: [dispayInfoMixin],
    components: {
      Divider,
      RoundedAction,
    },

    props: {
      currentTab: {
        type: String,
      },
    },

    mounted() {
      this.setNumberFocus();
    },

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
        callList: (state) => state.callList,
        newNumber: (state) => state.callOnWorkspace.newNumber,
      }),
      ...mapGetters('call', {
        isNewCall: 'IS_NEW_CALL',
      }),

      number: {
        get() {
          return this.newNumber;
        },
        set(value) {
          this.setNumber(value);
        },
      },

      isOnContacts() {
        return this.currentTab === 'contacts';
      },

      isOnHistory() {
        return this.currentTab === 'history';
      },

      isOnBridge() {
        return this.currentTab === 'bridge';
      },

      isBridge() {
        return (this.call.state !== CallActions.Hangup
          || this.call.state !== CallActions.Ringing)
          && this.callList.filter((call) => (
            call.state !== CallActions.Hangup
            || call.state !== CallActions.Ringing
          )).length > 1;
      },

      isTransfer() {
        return this.call.allowHangup;
      },

      isHangup() {
        return this.call.allowHangup;
      },

      isCall() {
        return this.isNewCall && this.number;
      },

      isNumberInput() {
        return this.isNewCall;
      },
    },

    methods: {
      setNumberFocus() {
        const input = this.$refs['number-input'];
        if (input) {
          this.$nextTick(() => input.focus());
        }
      },

      ...mapActions('call', {
        makeCall: 'CALL',
        hangup: 'HANGUP',
        setNumber: 'SET_NEW_NUMBER',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .call-header {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: (160px);
    height: (160px);
    margin: (20px) (20px) 0;
  }

  .call-header__actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: auto;

    .actions-wrap__left {
      display: flex;
      flex: 0 0 (190px); // x3 icons 50px + x2 margins 20px

      .call-action {
        margin-right: (20px);

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .call-header__profile-pic {
      flex: 0 0 (80px);
      width: (80px);
      height: (80px);
    }

    .actions-wrap__right {
      display: flex;
      flex: 0 0 (190px); // x3 icons 50px + x2 margins 20px
      justify-content: flex-end;

      .call-action {
        margin-left: (20px);

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .call-header__number {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: stretch;

    .call-profile__name {
      @extend .typo-heading-sm;
      margin-bottom: (5px);
    }

    .call-profile__number {
      @extend .typo-body-md;
    }

    .call-header__form-number {
      position: relative;
      flex: 0 0 auto;
      align-self: flex-end;
      display: flex;
      align-items: flex-end;

      &__input {
        @extend .typo-input;
        text-align: center;

        // make bottom border overflowing divider
        position: relative;
        bottom: (-1px);

        border: 1px solid transparent;
        border-bottom: (1px) solid #000;
        outline: none;

        &:focus {
          border: 1px solid #000;
        }
      }

      .icon-btn {
        position: absolute;
        right: (-24px);

        &:hover .icon {
          fill: #000;
          stroke: #000;
        }
      }
    }
  }
</style>
