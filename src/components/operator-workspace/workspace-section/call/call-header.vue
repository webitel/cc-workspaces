<template>
  <header class="call-header">
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

    <call-profile v-if="false"></call-profile>
    <form class="call-header__form-number">
      <input type="text">
    </form>

    <div class="actions-wrap actions-wrap__right">
      <rounded-action
        class="call-action"
        @click.native="currentTab = 'redirect'"
      >redirect
      </rounded-action>
      <rounded-action class="call-action">close</rounded-action>
    </div>
  </header>
</template>

<script>
  import CallProfile from './call-profile.vue';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-header',
    components: {
      CallProfile,
      RoundedAction,
    },
  };
</script>

<style lang="scss" scoped>
  .call-header {
    min-height: 160px;
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

  .call-header__form-number {
    align-self: flex-end;
  }
</style>
