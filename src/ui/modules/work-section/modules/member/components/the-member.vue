<template>
  <task-container>
    <template #header>
      <member-header
        :current-tab="currentTab"
        :size="size"
        @open-tab="openHistory"
      ></member-header>
    </template>
    <template #body>
      <history
        v-show="isHistoryOpened"
        :size="size" />
      <member-communications v-show="!isHistoryOpened" />
    </template>
  </task-container>
</template>

<script>
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import History from '../../_shared/components/workspace-history/components/history-container.vue';
import MemberCommunications from './member-communications.vue';
import MemberHeader from './member-header.vue';

export default {
  name: 'TheMember',
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
