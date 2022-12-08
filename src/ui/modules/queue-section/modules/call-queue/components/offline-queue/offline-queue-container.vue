<template>
  <task-queue-container>
    <div ref="scroll-wrap">
      <offline-preview
        v-for="(task) of dataList"
        :key="task.id"
        :opened="task === taskOnWorkspace"
        :task="task"
        :size="size"
        @click="openMember"
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
      this.loadList({ search: this.search, page: this.page, size: this.size });
    },

    ...mapActions('features/member', {
      loadList: 'LOAD_DATA_LIST',
      openMember: 'OPEN_MEMBER_ON_WORKSPACE',
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
