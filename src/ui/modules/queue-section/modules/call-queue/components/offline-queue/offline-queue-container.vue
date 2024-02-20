<template>
  <task-queue-container
    :empty="!dataList.length"
  >
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
import { useCachedInterval } from '@webitel/ui-sdk/src/composables/useCachedInterval/useCachedInterval';
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
  setup() {
    const { subscribe } = useCachedInterval({ timeout: 15 * 1000 });
    return { subscribe };
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
     this.taskOnWorkspace.id === task.id ? this.resetWorkspace() : this.openMember(task);
    },
  },
  mounted() {
    this.subscribe(this.loadDataList);
  },
  destroyed() {
    /*
    [WTEL-3064]
    When unmounting a offline-queue-container component (for example, when clicking on missed calls),
    in agent-workspace-action panel should display the last active event, except for the offline queue
    */
    this.resetWorkspace();
  },
};
</script>

<style lang="scss" scoped>
.offline-queue-container__scroll-wrap {
  display: contents;
}
</style>
