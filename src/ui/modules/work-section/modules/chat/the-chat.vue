<template>
  <article class="chat">
    <wt-loader v-if="isContactLoading" />
    <task-container v-else class="chat__wrapper">
      <template v-slot:header>
        <chat-header
          v-show="isChatHeader"
          :size="size"
          @openTab="openTab"
        />
        <media-viewer />
      </template>
      <template v-slot:body>
        <component
          :is="currentTab.component"
          :size="size"
          v-bind="currentTab.props"
          @closeTab="resetTab"
          @openTab="openTab"
        />
      </template>
      <template v-slot:footer>
        <chat-footer
          v-if="isChatFooter"
          :size="size"
        />
      </template>
    </task-container>
  </article>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import EmptyWorkspace from '../empty-workspace/components/empty-workspace.vue';
import ChatHeader from './chat-header/chat-header.vue';
import ChatMessagingContainer from './chat-messaging/chat-messaging.vue';
import ChatFooter from './chat-footer/chat-footer.vue';
import ChatTransferContainer from './chat-transfer-container/chat-transfer-container.vue';
import MediaViewer from './media-viewer/media-viewer.vue';
import TaskContainer from '../_shared/components/task-container/task-container.vue';
import sizeMixin from '../../../../../app/mixins/sizeMixin.js';

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
    ...mapState('ui/infoSec/client/contact', {
      isContactLoading: (state) => state.isLoading,
      contact: (state) => state.contact,
    }),
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
    ...mapGetters('features/chat/closed', {
      isChatClosed: 'IS_CHAT_ON_WORKSPACE_CLOSED',
    }),
    isChatHeader() {
      return this.currentTab.component !== 'empty-workspace';
    },
    // hide footer in transfer and empty-workspace tab or if closed chat was opened
    isChatFooter() {
      return (this.currentTab.component !== 'chat-transfer-container')
        && (this.currentTab.component !== 'empty-workspace')
        && !this.isChatClosed;
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
.chat {
  display: flex;
  height: 100%;

  &__wrapper {
    width: 100%;
  }

  .chat-messaging-container,
  .chat-transfer-container {
    flex-grow: 1;
  }

  :deep(.task-container .task-container__body-wrapper) {
    padding: 0;
  }
}


</style>
