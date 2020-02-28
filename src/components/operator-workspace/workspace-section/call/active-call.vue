<template>
  <div class="active-call">
    <call-header></call-header>
    <divider></divider>

    <section class="active-call__info">
      <client-history v-show="currentTab === 'history'"></client-history>
      <contacts v-show="currentTab === 'contacts'"></contacts>
      <redirect v-show="currentTab === 'redirect'"></redirect>
      <numpad v-show="currentTab === 'numpad'"></numpad>
    </section>

    <divider></divider>
    <call-footer></call-footer>
  </div>
</template>

<script>
  import CallHeader from './call-header.vue';
  import CallFooter from './call-footer.vue';
  import ClientHistory from '../workspace-client-history/client-history-container.vue';
  import Contacts from '../workspace-contacts/workspace-contacts-container.vue';
  import Redirect from '../workspace-redirect/workspace-redirect-container.vue';
  import Numpad from './call-numpad/numpad.vue';
  import Divider from '../../../utils/divider.vue';

  export default {
    name: 'active-call',
    components: {
      CallHeader,
      CallFooter,
      ClientHistory,
      Contacts,
      Redirect,
      Numpad,
      Divider,
    },

    data: () => ({
      currentTab: 'numpad',
    }),
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
