<template>
  <call-preview
    v-if="isPreviewCall"
    :size="size"
    @transfer="openTransfer"
  ></call-preview>

  <task-container v-else>
    <template v-slot:header>
      <call-header
        :current-tab="currentTab"
        :size="size"
        @openTab="currentTab = $event"
      ></call-header>
    </template>

    <template v-slot:body>
      <component
        :is="currentTab"
        :size="size"/>
    </template>

    <template v-slot:footer>
      <call-footer
        :current-tab="currentTab"
        :size="size"
        @openTab="currentTab = $event"
      ></call-footer>
    </template>
  </task-container>
</template>

<script>
import { mapGetters } from 'vuex';
import isIncomingRinging from '../../../../../features/modules/call/scripts/isIncomingRinging.js';
import TaskContainer from '../_shared/components/task-container/task-container.vue';
import History from '../_shared/components/workspace-history/components/history-container.vue';
import CallFooter from './components/call-footer.vue';
import CallHeader from './components/call-header.vue';
import Bridge from './components/call-merge/call-bridge-container.vue';
import Numpad from './components/call-numpad/numpad.vue';
import CallPreview from './components/call-preview.vue';
import Transfer from './components/call-transfer/call-transfer-container.vue';
import sizeMixin from '../../../../../app/mixins/sizeMixin.js';
import Contacts from './components/call-contacts/call-contacts-container.vue';
import HotkeyAction from '../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../hotkeys/useHotkeys.js';

export default {
  name: 'the-call',
  mixins: [sizeMixin],
  components: {
    TaskContainer,
    CallPreview,
    CallHeader,
    CallFooter,
    History,
    Contacts,
    Numpad,
    Transfer,
    Bridge,
  },

  data: () => ({
    currentTab: 'numpad',
    isPreviewTransfer: false,
    hotkeyUnsubscribers : [],
  }),

  watch: {
    call() {
      this.openCall();
    },
  },

  computed: {
    ...mapGetters('features/call', {
      call: 'CALL_ON_WORKSPACE',
    }),

    isPreviewCall() {
      if (this.isPreviewTransfer) return false;
      return isIncomingRinging(this.call);
    },
  },

  methods: {
    openTransfer() {
      this.isPreviewTransfer = true;
      this.currentTab = 'transfer';
    },
    openCall() {
      this.isPreviewTransfer = false;
      this.currentTab = 'numpad';
    },
    setupHotkeys() {
      const subscribers = [
        {
          event: HotkeyAction.TRANSFER,
          callback: () => {
            this.isPreviewTransfer ? this.openCall() : this.openTransfer();
          },
        },
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
