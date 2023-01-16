<template>
  <task-header>
    <template v-slot:before-avatar>
      <wt-rounded-action
        class="call-action"
        :active="isOnHistory"
        icon="history"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', 'history')"
      ></wt-rounded-action>
      <wt-rounded-action
        class="call-action"
        :active="isOnContacts"
        icon="contacts"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', 'contacts')"
      ></wt-rounded-action>
    </template>
    <template v-slot:after-avatar>
      <wt-rounded-action
        v-if="isBridge"
        class="call-action"
        :active="isOnBridge"
        icon="call-add-to"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', 'bridge')"
      ></wt-rounded-action>
      <wt-rounded-action
        v-if="isTransfer"
        class="call-action"
        icon="call-transfer"
        color="transfer"
        rounded
        wide
        @click="$emit('openTab', 'transfer')"
      ></wt-rounded-action>
      <wt-rounded-action
        v-if="isHangup"
        class="call-action"
        icon="call-end"
        color="danger"
        rounded
        wide
        @click="hangup"
      ></wt-rounded-action>
      <wt-rounded-action
        v-if="isDisplayCallRingingButton"
        class="call-action"
        icon="call-ringing"
        color="success"
        rounded
        wide
        @click="makeCall"
      ></wt-rounded-action>
    </template>
    <template v-slot:title>
      {{ displayName }}
    </template>
    <template v-slot:subtitle>
      {{ displayNumber }}
    </template>
  </task-header>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
  import { CallActions } from 'webitel-sdk';
  import displayInfoMixin from '../../../../../mixins/displayInfoMixin';
  import TaskHeader from '../../_shared/components/task-header/task-header.vue';

  export default {
    name: 'call-header',
    mixins: [displayInfoMixin],
    components: { TaskHeader },
    props: {
      currentTab: {
        type: String,
      },
    },

    computed: {
      ...mapState('features/call', {
        callList: (state) => state.callList,
      }),
      ...mapGetters('features/call', {
        call: 'CALL_ON_WORKSPACE',
        isNewCall: 'IS_NEW_CALL',
      }),

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
        return this.isNewCall && this.call.newNumber;
      },
      // The call button should be displayed in the dialing tab after the user enters it.
      // In the history tab, need to display after choosing a number from list and if it is possible to make a call
      isDisplayCallRingingButton() {
        return this.isOnHistory ? this.call.historyId && this.isCall : this.isCall;
      }
    },

    methods: {
      ...mapActions('features/call', {
        makeCall: 'CALL',
        hangup: 'HANGUP',
        setNumber: 'SET_NEW_NUMBER',
      }),
    },
  };
</script>

<style lang="scss" scoped>
</style>
