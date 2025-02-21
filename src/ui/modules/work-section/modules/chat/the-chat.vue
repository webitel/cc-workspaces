<template>
  <article class="chat">
    <wt-replace-transition appear>
      <task-container :key="chat.id" class="chat__wrapper"> //
          <template v-slot:header>
              <chat-header
                v-show="isChatHeader"
                :key="chat?.id"
                :size="size"
                @openTab="openTab"
              />
            <media-viewer />
          </template>
          <template v-slot:body>
              <component
                :is="currentTab.component"
                :key="chat?.id"
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
    </wt-replace-transition>
  </article>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import TaskContainer from '../_shared/components/task-container/task-container.vue';
import ChatHeader from './chat-header/chat-header.vue';
import ChatFooter from './chat-footer/chat-footer.vue';
import EmptyWorkspace from '../empty-workspace/components/empty-workspace.vue';
import ChatMessagingContainer from './chat-messaging/chat-messaging.vue';
import ChatTransferContainer from './chat-transfer-container/chat-transfer-container.vue';
import MediaViewer from './media-viewer/media-viewer.vue';
import sizeMixin from '../../../../../app/mixins/sizeMixin.js';
import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';

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
    WtReplaceTransition,
  },
  data: () => ({
    currentTab: {
      component: defaultTab
    },
    currentChatId: null,
  }),
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
    ...mapState('features/chat/chatHistory', {
      isHistoryLoaded: state => state.isLoaded,
    }),
    isChatHeader() {
      return this.currentTab.component !== 'empty-workspace';
    },
    // hide footer in transfer and empty-workspace tab or if closed chat was opened
    isChatFooter() {
      return this.currentTab.component === defaultTab;
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
    chat: {
      handler() {
        this.resetTab();
      },
      immediate: true,
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
