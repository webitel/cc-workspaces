<template>
  <section class="ws-worksection workspace-member">
    <member-header
      :current-tab="currentTab"
      @openTab="openHistory"
    ></member-header>
    <div class="ws-worksection-wrap">
      <history v-show="isHistoryOpened"/>
      <member-communications v-show="!isHistoryOpened"/>
    </div>
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

    computed: {
      isHistoryOpened() {
        return this.currentTab === 'history';
      },
    },

    methods: {
      openHistory(tab) {
        this.currentTab = this.currentTab ? '' : tab;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .workspace-member {
    padding: 20px;
    box-sizing: border-box;

    .ws-worksection__list {
      overflow: auto;
    }
  }
</style>
