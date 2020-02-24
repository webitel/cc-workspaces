<template>
  <div class="active-call">
    <header class="active-call__header">
      <div class="actions-wrap actions-wrap__left">
        <rounded-action
          class="call-action"
          @click.native="currentTab = 'history'"
        >history
        </rounded-action>
        <rounded-action
          class="call-action"
          @click.native="currentTab = 'contacts'"
        >contacts
        </rounded-action>
      </div>
      <div class="call-profile">
        <img class="call-profile__pic" src="https://cs4.pikabu.ru/post_img/2016/05/22/8/1463919617179069423.jpg"
             alt="client photo">
        <div class="call-profile__name">
          {{computeDisplayName}}
        </div>
        <div class="call-profile__number">
          {{computeDisplayNumber}}
        </div>
      </div>
      <div class="actions-wrap actions-wrap__right">
        <rounded-action
          class="call-action"
          @click.native="currentTab = 'transfer'"
        >Transfer
        </rounded-action>
        <rounded-action
          class="call-action"
          @click.native="hangup(itemIndex)"
        >Hangup
        </rounded-action>
      </div>
    </header>
    <divider></divider>
    <section class="active-call__info">
      <client-history v-show="currentTab === 'history'"></client-history>
      <contacts v-show="currentTab === 'contacts'"></contacts>
      <transfer
        v-show="currentTab === 'transfer'"
        @select="transfer({user: $event, index: itemIndex})"
      ></transfer>
    </section>
    <divider></divider>
    <div class="actions-wrap call-bottom-actions">
      <rounded-action class="call-action">numpad</rounded-action>
      <rounded-action
        class="call-action"
        @click.native="toggleMute(itemIndex)"
      >mute</rounded-action>
      <rounded-action
        class="call-action"
        @click.native="toggleHold(itemIndex)"
      >hold</rounded-action>
      <rounded-action class="call-action">record</rounded-action>
      <rounded-action class="call-action">edit</rounded-action>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import callInfo from '../../../../mixins/callInfoMixin';
  import ClientHistory from '../workspace-client-history/client-history-container.vue';
  import Contacts from '../workspace-contacts/workspace-contacts-container.vue';
  import Transfer from '../workspace-transfer/workspace-transfer-container.vue';
  import Divider from '../../../utils/divider.vue';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'active-call',
    mixins: [callInfo],
    components: {
      RoundedAction,
      ClientHistory,
      Contacts,
      Transfer,
      Divider,
    },

    data: () => ({
      currentTab: 'history',
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

  .active-call__header {
    display: flex;
    justify-content: space-between;
  }

  .call-bottom-actions {
    display: flex;
    justify-content: space-evenly;
    padding: 10px 0;
  }

  .actions-wrap__left {
    .call-action:first-child {
      margin-right: 20px;
    }
  }

  .actions-wrap__right {
    .call-action:last-child {
      margin-left: 20px;
    }
  }

  .active-call__info {
    margin: 20px 0;
    flex-grow: 1;
  }
</style>
