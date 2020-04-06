<template>
  <section class="ws-worksection workspace-member">
    <member-header
      :current-tab="currentTab"
      @openTab="openHistory"
    ></member-header>
    <history v-if="currentTab === 'history'"/>
    <member-communications v-else/>
  </section>
</template>

<script>
  import MemberHeader from './member-header.vue';
  import MemberCommunications from './member-communications.vue';
  import History from '../shared/workspace-history/history-container.vue';

  export default {
    name: 'the-member',
    components: {
      MemberHeader,
      MemberCommunications,
      History,
    },

    data: () => ({
      currentTab: '',
    }),

    methods: {
      openHistory(tab) {
        this.currentTab = this.currentTab ? '' : tab;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .workspace-member {
    padding: calcVH(20px);
    box-sizing: border-box;

    .ws-worksection__list {
      overflow: auto;
    }
  }
</style>
