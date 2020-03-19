<template>
  <header class="cc-header">
    <div class="cc-header__container">
      <switcher v-model="isAgent"></switcher>
      <status-select/>
      <img
        class="cc-header__profile-pic"
        src="../../assets/agent-workspace/default-avatar.svg"
        alt="profile pic"
      >
    </div>
  </header>
</template>

<script>
  import { mapActions } from 'vuex';
  import Switcher from './cc-header-switcher.vue';
  import StatusSelect from './status-select.vue';

  export default {
    name: 'cc-header',
    components: {
      Switcher,
      StatusSelect,
    },

    computed: {
      isAgent: {
        get() {
          return this.$store.getters['status/IS_AGENT'];
        },
        set() {
          this.toggleCCenterMode();
        },
      },
    },

    methods: {
      ...mapActions('status', {
        toggleCCenterMode: 'TOGGLE_CCENTER_MODE',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .cc-header {
    padding: calcVH(10px) calcVH(77px);
    background: $header-bg-color;
  }

  .cc-header__container {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .status-select {
      margin-left: calcVH(30px);
    }

    .cc-header__profile-pic {
      width: calcVH(24px);
      height: calcVH(24px);
      margin-left: calcVH(30px);
      cursor: pointer;
    }
  }
</style>
