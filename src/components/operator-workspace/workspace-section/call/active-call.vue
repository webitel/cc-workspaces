<template>
  <div class="active-call">
    <call-header
      @openTab="currentTab = $event"
    ></call-header>
    <divider></divider>

    <section class="active-call__info">
      <client-history v-show="currentTab === 'history'"></client-history>
      <contacts v-show="currentTab === 'contacts'"></contacts>
      <transfer v-show="currentTab === 'redirect'"></transfer>
      <numpad v-show="currentTab === 'numpad'"></numpad>
    </section>

    <divider></divider>
    <call-footer></call-footer>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import callInfo from '../../../../mixins/callInfoMixin';
  import CallHeader from './call-header.vue';
  import CallFooter from './call-footer.vue';
  import ClientHistory from '../workspace-client-history/client-history-container.vue';
  import Contacts from '../workspace-contacts/workspace-contacts-container.vue';
  import Transfer from '../workspace-transfer/workspace-transfer-container.vue';
  import Divider from '../../../utils/divider.vue';
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
      ...mapState('operator', {
        itemInstance: (state) => state.openedItem.item,
        itemIndex: (state) => state.openedItem.index,
      }),
    },

    methods: {
      ...mapActions('operator', {
        answer: 'ANSWER',
        transfer: 'TRANSFER',
        hangup: 'HANGUP',
        openCall: 'OPEN_CALL',
        toggleMute: 'TOGGLE_MUTE',
        toggleHold: 'TOGGLE_HOLD',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .active-call {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .call-header {
    display: flex;
    justify-content: space-between;
  }

  .active-call__info {
    margin: 20px 0;
    flex: 1; // fill all available container height

    display: flex; // make child height 100& of container
    flex-direction: column;
  }
</style>
