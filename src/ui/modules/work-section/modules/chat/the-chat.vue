<template>
  <article class="chat">
    <task-container v-if="chatContactIsLoaded" class="chat__wrapper">
      <template #header>
        <chat-header
          v-show="isChatHeader"
          :size="size"
          @open-tab="openTab"
        />
        <media-viewer />
      </template>
      <template #body>
        <component
          :is="currentTab.component"
          :size="size"
          v-bind="currentTab.props"
          :contact="chatContact"
          @close-tab="resetTab"
          @open-tab="openTab"
        />
      </template>
      <template #footer>
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

import sizeMixin from '../../../../../app/mixins/sizeMixin.js';
import TaskContainer from '../_shared/components/task-container/task-container.vue';
import EmptyWorkspace from '../empty-workspace/components/empty-workspace.vue';
import ChatFooter from './chat-footer/chat-footer.vue';
import ChatHeader from './chat-header/chat-header.vue';
import ChatMessagingContainer from './chat-messaging/chat-messaging.vue';
import ChatTransferContainer from './chat-transfer-continer/chat-transfer-container.vue';
import MediaViewer from './media-viewer/media-viewer.vue';
import { getLinkedContact } from './scripts/getLinkedContact.js';

const defaultTab = 'chat-messaging-container';

export default {
  name: 'TheChat',
  components: {
    TaskContainer,
    MediaViewer,
    ChatHeader,
    ChatMessagingContainer,
    ChatTransferContainer,
    EmptyWorkspace,
    ChatFooter,
  },
  mixins: [sizeMixin],
  data: () => ({
    hotkeyUnsubscribers : [],
    chatContact: null,
    currentTab: { component: defaultTab },
    chatContactIsLoaded: false,
  }),
  computed: {
    ...mapState('ui/infoSec/client/contact', {
      contact: state => state.contact,
    }),
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
    isChatHeader() {
      return this.currentTab.component !== 'empty-workspace';
    },
    // hide footer in transfer and empty-workspace tab or if closed chat was opened
    isChatFooter() {
      return this.currentTab.component === defaultTab;
    },
  },
  watch: {
    chat: {
      async handler() {
        this.resetTab();
        this.chatContact = await getLinkedContact(this.chat, this.contact); // We must use this.chat.contact. This logic must be removed, when back-end will be able to return chat.contact: { id: fieldValue, name: fieldValue } (when contact was linked to chat)
        this.chatContactIsLoaded = true;
      },
      immediate: true,
    },
    async contact() { // TODO: need to be removed after chat backend refactoring https://webitel.atlassian.net/browse/WTEL-6271
      this.chatContact = await getLinkedContact(this.chat, this.contact); // We must use this.chat.contact. This logic must be removed, when back-end will be able to return chat.contact: { id: fieldValue, name: fieldValue } (when contact was linked to chat)
      this.chatContactIsLoaded = true;
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
