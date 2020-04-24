<template>
  <div class="active-call">
    <call-header
      :current-tab="currentTab"
      @openTab="currentTab = $event"
    ></call-header>
    <divider/>

    <section class="ws-worksection-wrap">
      <component :is="computeCurrentTab"/>
    </section>

    <divider/>
    <call-footer
      :current-tab="currentTab"
      @openTab="currentTab = $event"
    ></call-footer>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import callTimer from '../../../../mixins/callTimerMixin';
  import CallHeader from './call-header.vue';
  import CallFooter from './call-footer.vue';
  import Divider from '../../../utils/divider.vue';
  import History from '../shared/workspace-history/history-container.vue';
  import Contacts from '../shared/workspace-contacts/workspace-contacts-container.vue';
  import Transfer from '../shared/workspace-transfer/workspace-transfer-container.vue';
  import Bridge from '../shared/workspace-bridge/workspace-bridge-container.vue';
  import Numpad from './call-numpad/numpad.vue';
  import CallStates from '../../../../store/modules/call/callUtils/CallStates';

  export default {
    name: 'active-call',
    mixins: [callTimer],
    components: {
      CallHeader,
      CallFooter,
      History,
      Contacts,
      Numpad,
      Transfer,
      Bridge,
      Divider,
    },

    data: () => ({
      currentTab: 'numpad',
    }),

    mounted() {
      this.setInitinalCurrentTab();
    },

    computed: {
      computeCurrentTab() {
        return this.currentTab;
      },

      ...mapState('call', {
        callState: (state) => state.callState,
      }),
    },

    methods: {
      setInitinalCurrentTab() {
        switch (this.callState) {
          case CallStates.TRANSFER:
            this.currentTab = 'transfer';
            break;
          default:
            break;
        }
      },

      ...mapActions('call', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
        openCall: 'OPEN_CALL_ON_WORKSPACE',
      }),
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
