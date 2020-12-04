<template>
  <call-preview
    v-if="isPreviewCall"
    @transfer="openTransfer"
  ></call-preview>

  <section class="active-call" v-else>
    <call-header
      :current-tab="currentTab"
      @openTab="currentTab = $event"
    ></call-header>

    <section class="ws-worksection-wrap">
      <component :is="currentTab"/>
    </section>

    <call-footer
      :current-tab="currentTab"
      @openTab="currentTab = $event"
    ></call-footer>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import CallPreview from './call-preview.vue';
  import CallHeader from './call-header.vue';
  import CallFooter from './call-footer.vue';
  import History from '../shared/workspace-history/history-container.vue';
  import Contacts from '../shared/workspace-contacts/workspace-contacts-container.vue';
  import Transfer from '../shared/workspace-transfer/workspace-transfer-container.vue';
  import Bridge from '../shared/workspace-bridge/workspace-bridge-container.vue';
  import Numpad from './call-numpad/numpad.vue';
  import callTimer from '../../../../mixins/callTimerMixin';
  import isIncomingRinging from '../../../../store/modules/call/scripts/isIncomingRinging';

  export default {
    name: 'the-call',
    mixins: [callTimer],
    components: {
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
    }),

    watch: {
      call() {
        this.isPreviewTransfer = false;
        this.currentTab = 'numpad';
      },
    },

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
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
    },
  };
</script>

<style lang="scss" scoped>
  .active-call {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
  }
</style>
