<template>
  <task-header :size="size">
    <template #before-avatar>
      <wt-rounded-action
        class="call-action"
        :active="isOnHistory"
        :size="size"
        icon="history"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', CallTab.History)"
      ></wt-rounded-action>
      <wt-rounded-action
        class="call-action"
        :active="isOnContacts"
        :size="size"
        icon="contacts"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', CallTab.Contacts)"
      ></wt-rounded-action>
    </template>
    <template #after-avatar>
      <slot name="after-avatar">
        <wt-rounded-action
          v-if="isBridge"
          class="call-action"
          :active="isOnBridge"
          :size="size"
          icon="call-add-to"
          color="secondary"
          rounded
          wide
          @click="$emit('openTab', CallTab.Bridge)"
        ></wt-rounded-action>
        <wt-rounded-action
          v-if="isTransfer"
          class="call-action"
          :size="size"
          icon="call-transfer--filled"
          color="transfer"
          rounded
          wide
          @click="$emit('openTab', CallTab.Transfer)"
        ></wt-rounded-action>
      </slot>
      <wt-rounded-action
        v-if="isHangup"
        class="call-action"
        :size="size"
        icon="call-end--filled"
        color="error"
        rounded
        wide
        @click="hangup"
      ></wt-rounded-action>
      <wt-rounded-action
        v-if="isDisplayCallButton"
        class="call-action"
        :size="size"
        icon="call-ringing--filled"
        color="success"
        rounded
        wide
        @click="makeCall"
      ></wt-rounded-action>
    </template>
    <template #title>
      {{ displayName }}
    </template>
    <template #subtitle>
      {{ displayNumber }}
    </template>
  </task-header>
</template>

<script>
  import { mapActions, mapGetters,mapState } from 'vuex';
  import { CallActions } from 'webitel-sdk';

  import sizeMixin from '../../../../../../app/mixins/sizeMixin';
  import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
  import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
  import displayInfoMixin from '../../../../../mixins/displayInfoMixin';
  import TaskHeader from '../../_shared/components/task-header/task-header.vue';
  import { CallTab } from '../enums/CallTab.enum';

  export default {
    name: 'CallHeader',
    components: { TaskHeader },
    mixins: [displayInfoMixin, sizeMixin],
    props: {
      currentTab: {
        type: String,
      },
    },

    data: () => ({
      hotkeyUnsubscribers : [],
      // Made CallTab available in template (required for Options API)
      CallTab: CallTab,
    }),

    computed: {
      ...mapState('features/call', {
        callList: (state) => state.callList,
      }),
      ...mapGetters('features/call', {
        call: 'CALL_ON_WORKSPACE',
        isNewCall: 'IS_NEW_CALL',
      }),

      isOnContacts() {
        return this.currentTab === CallTab.Contacts;
      },

      isOnHistory() {
        return this.currentTab === CallTab.History;
      },

      isOnBridge() {
        return this.currentTab === CallTab.Bridge;
      },

      isOnNumpad() {
        return this.currentTab === CallTab.Numpad;
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

      isDisplayCallButton() {
        return (this.isOnNumpad || this.isOnBridge) && this.isCall;
      }
    },

    methods: {
      ...mapActions('features/call', {
        makeCall: 'CALL',
        hangup: 'HANGUP',
        setNumber: 'SET_NEW_NUMBER',
      }),
      setupHotkeys() {
        const subscribers = [
          {
            event: HotkeyAction.END,
            callback: this.hangup
          }
        ];
        this.hotkeyUnsubscribers  = useHotkeys(subscribers);
      }
    },

    mounted() {
      this.setupHotkeys();
    },

    unmounted() {
      this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());
    },
  };
</script>

<style lang="scss" scoped>
</style>
