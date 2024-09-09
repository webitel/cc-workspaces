<template>
  <article class="chat">
    <Transition name="soft-loading" mode="out-in">
      <wt-loader v-if="!isLoaded" />
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
    </Transition>
  </article>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import EmptyWorkspace from '../../empty-workspace/components/empty-workspace.vue';
import ChatHeader from './chat-header/chat-header.vue';
import ChatMessagingContainer from './chat-messaging/chat-messaging.vue';
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
    isLoaded: false,
  }),
  computed: {
    ...mapState('ui/infoSec/client/contact', {
      isContactLoading: (state) => state.isLoading,
    }),
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
    isChatHeader() {
      return this.currentTab.component !== 'empty-workspace';
    },
    // hide footer in transfer and empty-workspace tab
    isChatFooter() {
      return (this.currentTab.component !== 'chat-transfer-container') && (this.currentTab.component !== 'empty-workspace');
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
    isContactLoading() {
      if (!this.isContactLoading) this.isLoaded = true;
      // because we need to watch is contact to finish loading
    }
  },
};
</script>

<style lang="scss" scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chat-messaging-container,
  .chat-transfer-container {
    flex-grow: 1;
  }
}

.soft-loading-enter-active,
.soft-loading-leave-active {
  transition: all 0.15s ease-in;
}

.soft-loading-enter-from,
.soft-loading-leave-to {
  opacity: 0;
}


</style>
