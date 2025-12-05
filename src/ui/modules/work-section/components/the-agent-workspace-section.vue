<template>
  <section
    class="workspace-section work-section"
    :class="[
      `work-section--${size}`
    ]"
  >
    <div class="workspace-section__collapse-actions">
      <collapse-action
        v-if="collapsible"
        :collapsed="collapsed"
        @click="$emit('resize')"
      />
    </div>
      <keep-alive>
        <component
          :is="workspaceComponent"
          class="work-section__main-content"
          :size="size"
        />
      </keep-alive>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import sizeMixin from '../../../../app/mixins/sizeMixin';
import WorkspaceStates
  from '../../../enums/WorkspaceState.enum';
import Call from '../modules/call/components/the-call.vue';
import VideoCall from '../modules/call/module/video-call/components/the-video-call.vue'
import Chat from '../modules/chat/the-chat.vue';
import EmptyWorkspace from '../modules/empty-workspace/components/empty-workspace-empty.vue';
import Job from '../modules/job/components/the-job.vue';
import Member from '../modules/member/components/the-member.vue';


export default {
  name: 'TheAgentWorkspaceSection',
  components: {
    Call,
    VideoCall,
    Chat,
    Member,
    Job,
    EmptyWorkspace,
    CollapseAction,
  },
  mixins: [sizeMixin],
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters('workspace', {
      state: 'WORKSRACE_STATE',
    }),
    ...mapGetters('features/call/videoCall', {
      isVideoCall: 'IS_VIDEO_CALL',
    }),
    workspaceComponent() {
      switch (this.state) {
        case WorkspaceStates.CALL:
          return this.isVideoCall ? VideoCall : 'call';
        case WorkspaceStates.CHAT:
          return 'chat';
        case WorkspaceStates.MEMBER:
          return 'member';
        case WorkspaceStates.JOB:
          return 'job';
        default:
          return 'empty-workspace';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.work-section {
  display: flex;
  flex-direction: column;
  min-width: 0;
  will-change: width;
  gap: var(--spacing-2xs);
  transition: var(--transition);

  &--md {
    /* should be bigger than info-section 1 1 320px cause info section should */
    flex: 10 10 400px;
  }
  &--sm {
    flex: 0 0 400px;
  }
}

.workspace-section__collapse-actions {
  line-height: 0;
}

.work-section__main-content {
  flex-grow: 1;
  min-height: 0;
}
</style>
