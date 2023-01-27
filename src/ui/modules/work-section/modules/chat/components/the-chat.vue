<template>
  <task-container class="the-chat">
    <template v-slot:header>
      <chat-header
        v-show="isChatHeader"
        :size="size"
        @openTab="openTab"
      ></chat-header>
      <media-viewer />
    </template>
    <template v-slot:body>
      <component
        :is="currentTab.component"
        :size="size"
        :current-tab="currentTab.component"
        v-bind="currentTab.props"
        @closeTab="resetTab"
        @openTab="openTab"
      ></component>
    </template>
    <template v-slot:footer>
      <chat-footer
        v-if="isChatFooter"
        :size="size"
      ></chat-footer>
    </template>
  </task-container>
</template>

<script>
import { mapGetters } from 'vuex';
import EmptyWorkspace from '../../empty-workspace/components/empty-workspace.vue';
import ChatHeader from './chat-header/chat-header.vue';
import ChatMessagingContainer from './chat-messaging-container/chat-messaging-container.vue';
import ChatFooter from './chat-footer/chat-footer.vue';
import ChatTransferContainer from './chat-transfer-container/chat-transfer-container.vue';
import MediaViewer from './media-viewer/media-viewer.vue';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

const defaultTab = 'chat-messaging-container';

export default {
  name: 'the-chat',
  mixins: [sizeMixin],
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
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
    isChatHeader() {
      return this.currentTab.component !== 'empty-workspace';
    },
    // hide footer in transfer tab
    isChatFooter() {
      return this.currentTab.component !== 'chat-transfer-container';
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
  watch: {
    chat() {
      this.resetTab();
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
    max-height: 100%;
  }
}
</style>
