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
  import History from '../../shared/components/workspace-history/components/history-container.vue';
  import Contacts from './call-contacts/call-contacts-container.vue';
  import Transfer from './call-transfer/call-transfer-container.vue';
  import Bridge from './call-merge/call-bridge-container.vue';
  import Numpad from './call-numpad/numpad.vue';
  import isIncomingRinging from '../../../../../../features/call/scripts/isIncomingRinging';

  export default {
    name: 'the-call',
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
