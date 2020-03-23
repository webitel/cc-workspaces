<template>
  <div class="active-call">
    <call-header
      :current-tab="currentTab"
      @openTab="currentTab = $event"
    ></call-header>
    <divider></divider>

    <section class="ws-worksection-wrap">
      <component :is="computeCurrentTab"></component>
    </section>

    <divider></divider>
    <call-footer
      :current-tab="currentTab"
      @openTab="currentTab = $event"
    ></call-footer>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import callInfo from '../../../../mixins/callInfoMixin';
  import CallHeader from './call-header.vue';
  import CallFooter from './call-footer.vue';
  import Divider from '../../../utils/divider.vue';
  import ClientHistory from '../workspace-client-history/client-history-container.vue';
  import Contacts from '../workspace-contacts/workspace-contacts-container.vue';
  import Transfer from '../workspace-transfer/workspace-transfer-container.vue';
  import Numpad from './call-numpad/numpad.vue';

  export default {
    name: 'active-call',
    mixins: [callInfo],
    components: {
      CallHeader,
      CallFooter,
      ClientHistory,
      Contacts,
      Numpad,
      Transfer,
      Divider,
    },

    data: () => ({
      currentTab: 'numpad',
    }),

    computed: {
      computeCurrentTab() {
        switch (this.currentTab) {
          case 'history':
            return 'client-history';
          case 'contacts':
            return 'contacts';
          case 'transfer':
            return 'transfer';
          case 'numpad':
            return 'numpad';
          default:
            return '';
        }
      },

      ...mapState('workspace', {}),
    },

    methods: {
      ...mapActions('workspace', {
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

  .ws-worksection-wrap {
    margin: calcVH(20px);
    flex-grow: 1; // fill all available container height
    min-height: 0;
    display: flex;
  }
</style>
