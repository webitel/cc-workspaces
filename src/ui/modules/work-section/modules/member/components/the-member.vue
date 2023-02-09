<template>
  <task-container>
    <template v-slot:header>
      <member-header
        :current-tab="currentTab"
        :size="size"
        @openTab="openHistory"
      ></member-header>
    </template>
    <template v-slot:body>
      <history v-show="isHistoryOpened" />
      <member-communications v-show="!isHistoryOpened" />
    </template>
  </task-container>
</template>

<script>
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import History from '../../_shared/components/workspace-history/components/history-container.vue';
import MemberCommunications from './member-communications.vue';
import MemberHeader from './member-header.vue';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'the-member',
  components: {
    TaskContainer,
    MemberHeader,
    MemberCommunications,
    History,
  },
  mixins: [sizeMixin],

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
</style>
