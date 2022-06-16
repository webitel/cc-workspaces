<template>
  <task-container class="the-chat">
    <template v-slot:header>
      <chat-header
        v-show="isChatHeader"
        @openTab="openTab"
      ></chat-header>
      <media-viewer />
    </template>
    <template v-slot:body>
      <component
        :is="currentTab.component"
        v-bind="currentTab.props"
        @closeTab="resetTab"
        @openTab="openTab"
      ></component>
    </template>
    <template v-slot:footer>
      <chat-footer></chat-footer>
    </template>
  </task-container>
</template>

<script>
import EmptyWorkspace from '../../empty-workspace/components/empty-workspace.vue';
import ChatHeader from './chat-header/chat-header.vue';
import ChatMessagingContainer from './chat-messaging-container/chat-messaging-container.vue';
import ChatFooter from './chat-footer/chat-footer.vue';
import ChatTransferContainer from './chat-transfer-container/chat-transfer-container.vue';
import MediaViewer from './media-viewer/media-viewer.vue';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';

const defaultTab = 'chat-messaging-container';

export default {
  name: 'the-chat',
  components: {
    TaskContainer,
    MediaViewer,
    ChatHeader,
    ChatMessagingContainer,
    ChatTransferContainer,
    EmptyWorkspace,
    ChatFooter,
  },
  data: () => ({
    currentTab: { component: defaultTab },
  }),
  computed: {
    isChatHeader() {
      return this.currentTab.component !== 'empty-workspace';
    },
  },
  methods: {
    openTab(tab) {
      switch (tab) {
        case 'transfer':
          this.currentTab = { component: 'chat-transfer-container' };
          break;
        case 'successful-transfer':
          this.currentTab = { component: 'empty-workspace', props: { type: 'transfer' } };
          break;
        default: {
          throw new Error(`Unknown chat tab: ${tab}`);
        }
      }
    },
    resetTab() {
      this.currentTab = { component: defaultTab };
    },
  },
};
</script>

<style lang="scss" scoped>
.the-chat {
  display: flex;
  flex-direction: column;
  height: 100%;

  .chat-messaging-container,
  .chat-transfer-container {
    flex-grow: 1;
  }

  .chat-transfer-container.ws-worksection {
    height: auto;
    min-height: 0;
  }
}
</style>
