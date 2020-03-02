<template>
  <header class="call-header">
    <div class="actions-wrap actions-wrap__left">
      <rounded-action
        class="call-action secondary"
        @click.native="$emit('openTab', 'contacts')"
      >contacts
      </rounded-action>
      <rounded-action
        class="call-action secondary"
        @click.native="$emit('openTab', 'history')"
      >history
      </rounded-action>
    </div>

    <call-profile v-if="callState !== 'NEW'"></call-profile>
    <form
      v-else
      class="call-header__form-number"
    >
      <input v-model="number" type="text" autofocus>
    </form>

    <div class="actions-wrap actions-wrap__right">
<!--      v-if="callState !== 'NEW'"-->
      <rounded-action
        class="call-action transfer"
        @click.native="$emit('openTab', 'transfer')"
      >transfer
      </rounded-action>
      <rounded-action
        v-if="callState !== 'NEW'"
        class="call-action end"
        @click.native="hangup()"
      >close
      </rounded-action>

      <rounded-action
        v-if="callState === 'NEW'"
        class="call-action call"
        @click.native="call"
      >call
      </rounded-action>
    </div>
  </header>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import CallProfile from './call-profile.vue';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-header',
    components: {
      CallProfile,
      RoundedAction,
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
    height: 130px;
  }

  .actions-wrap__left {
    flex: 1 1 auto;

    .call-action:first-child {
      margin-right: 20px;
    }
  }

  .actions-wrap__right {
    flex: 1 1 auto;

    .call-action:last-child {
      margin-left: 20px;
    }
  }

  .call-profile {
    flex: 0 0  auto;
  }

  .call-header__form-number {
    flex: 0 0  auto;
    align-self: flex-end;
  }
</style>
