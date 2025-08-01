<template>
  <call-preview
    v-if="isPreviewCall"
    :size="size"
    @transfer="openTransfer"
  ></call-preview>

  <task-container v-else>
    <template #header>
      <call-header
        :current-tab="currentTab"
        :size="size"
        @open-tab="currentTab = $event"
      ></call-header>
    </template>
    <template #body>
      <component
        :is="currentTab"
        :size="size" />
    </template>

    <template #footer>
      <call-footer
        :current-tab="currentTab"
        :size="size"
        @open-tab="currentTab = $event"
      ></call-footer>
    </template>
  </task-container>
</template>

<script>
import { mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import isIncomingRinging from '../../../../../../features/modules/call/scripts/isIncomingRinging';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import History from '../../_shared/components/workspace-history/components/history-container.vue';
import Contacts from './call-contacts/call-contacts-container.vue';
import CallFooter from './call-footer.vue';
import CallHeader from './call-header.vue';
import Bridge from './call-merge/call-bridge-container.vue';
import Numpad from './call-numpad/numpad.vue';
import CallPreview from './call-preview.vue';
import Transfer from './call-transfer/call-transfer-container.vue';

export default {
  name: 'TheCall',
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
  mixins: [sizeMixin],

  data: () => ({
    currentTab: 'numpad',
    isPreviewTransfer: false,
    hotkeyUnsubscribers: [],
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

  mounted() {
    this.setupHotkeys();
  },

  unmounted() {
    this.hotkeyUnsubscribers.forEach((unsubscribe) => unsubscribe());
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
      this.hotkeyUnsubscribers = useHotkeys(subscribers);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
