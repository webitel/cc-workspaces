<template>
  <task-queue-container>
    <div class="offline-queue-container__scroll-wrap" ref="scroll-wrap">
      <offline-preview
        v-for="(task) of dataList"
        :key="task.id"
        :opened="task === taskOnWorkspace"
        :task="task"
        :size="size"
        @click="toggleMemberDisplay(task)"
      ></offline-preview>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"
      />
    </div>
  </task-queue-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import OfflinePreview from './offline-queue-preview.vue';

export default {
  name: 'offline-queue-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    TaskQueueContainer,
    OfflinePreview,
  },

  computed: {
    ...mapState('features/member', {
      dataList: (state) => state.memberList,
    }),
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
  },

  methods: {
    loadDataList() {
      this.loadList({ search: this.dataSearch, page: this.dataPage, size: this.dataSize });
    },

    ...mapActions('features/member', {
      loadList: 'LOAD_DATA_LIST',
      openMember: 'OPEN_MEMBER_ON_WORKSPACE',
      resetWorkspace: 'RESET_WORKSPACE',
    }),
    toggleMemberDisplay(task) {
     this.taskOnWorkspace.id === task.id ? this.resetWorkspace(task) : this.openMember(task);
    },
  },
  beforeDestroy() {
    this.resetWorkspace();
  },
};
</script>

<style lang="scss" scoped>
.offline-queue-container__scroll-wrap {
  display: contents;
}
</style>
