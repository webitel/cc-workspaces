<template>
  <header class="call-header">
    <div class="call-header__actions">
      <div class="actions-wrap actions-wrap__left">
        <rounded-action
          class="call-action secondary"
          :class="{'active': currentTab === 'contacts'}"
          @click.native="$emit('openTab', 'contacts')"
        >
          <icon>
            <svg class="icon icon-call-contacts-md md">
              <use xlink:href="#icon-call-contacts-md"></use>
            </svg>
          </icon>
        </rounded-action>
        <rounded-action
          class="call-action secondary"
          :class="{'active': currentTab === 'history'}"
          @click.native="$emit('openTab', 'history')"
        >
          <icon>
            <svg class="icon icon-call-history-md md">
              <use xlink:href="#icon-call-history-md"></use>
            </svg>
          </icon>
        </rounded-action>
      </div>
      <img class="call-header__profile-pic"
           src="../../../../assets/operator-workspace/default-avatar.svg"
           alt="client photo">
      <div class="actions-wrap actions-wrap__right">
        <rounded-action
          v-if="true || callState !== 'NEW'"
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
          v-if="true || callState !== 'NEW'"
          class="call-action end"
          @click.native="hangup()"
        >
          <icon>
            <svg class="icon icon-call-end-md md">
              <use xlink:href="#icon-call-end-md"></use>
            </svg>
          </icon>
        </rounded-action>

        <rounded-action
          v-if="true || callState === 'NEW' && number"
          class="call-action call"
          @click.native="call"
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
      <div v-if="callState !== 'NEW'" class="">
        <div class="call-profile__name">
          {{'aaaaaa' + getDisplayName}}
        </div>
        <div class="call-profile__number">
          {{'aaaaaa' + getDisplayNumber}}
        </div>
      </div>
      <form
        v-else
        class="call-header__form-number"
      >
        <input
          class="call-header__form-number__input"
          v-model="number"
          type="text"
          autofocus
        >
      </form>
    </div>
  </header>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-header',
    components: {
      RoundedAction,
    },

    props: {
      currentTab: {
        type: String,
      },
    },

    computed: {
      ...mapState('operator', {
        callState: (state) => state.callState,
      }),

      number: {
        get() {
          return this.$store.state.operator.newCallNumber;
        },
        set(value) {
          this.setNumber(value);
        },
      },
    },

    methods: {
      ...mapActions('operator', {
        call: 'CALL_TO_NEW_NUMBER',
        hangup: 'HANGUP',
        setNumber: 'SET_NEW_CALL_NUMBER',
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
    height: calcRem(160px);
    margin: calcRem(20px) calcRem(20px) 0;
  }

  .call-header__actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;

    .actions-wrap__left {
      display: flex;
      flex: 0 0 calcRem(190px); // x3 icons 50px + x2 margins 20px

      .call-action {
        margin-right: calcRem(20px);

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .call-header__profile-pic {
      flex: 0 0 calcRem(80px);
      width: calcRem(80px);
      height: calcRem(80px);
    }

    .actions-wrap__right {
      display: flex;
      flex: 0 0 calcRem(190px); // x3 icons 50px + x2 margins 20px
      justify-content: flex-end;

      .call-action {
        margin-left: calcRem(20px);

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .call-header__number {
    display: flex;
    justify-content: center;
    align-items: stretch;
    //margin-top: calcRem(10px);
    margin-top: auto;

    .call-profile__name {
      @extend .typo-heading-sm;
      margin-bottom: calcRem(5px);
    }

    .call-profile__number {
      @extend .typo-body-md;
    }

    .call-header__form-number {
      flex: 0 0 auto;
      align-self: flex-end;

      &__input {
        @extend .typo-input;
        text-align: center;

        // make bottom border overflowing divider
        position: relative;
        bottom: calcRem(-1px);

        border: none;
        border-bottom: calcRem(1px) solid #000;
      }
    }
  }
</style>
