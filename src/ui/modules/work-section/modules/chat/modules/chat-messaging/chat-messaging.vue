<template>
  <div
    class="chat-messaging"
    :class="[
      `chat-messaging--${props.size}`,
    ]"
    @dragenter.prevent="handleDragEnter"
  >
    <dropzone
      v-show="isDropzoneVisible"
      @dragenter.prevent
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
    />
    <chat-history
      v-if="props.contact?.id"
      :contact="props.contact"
      :size="props.size"
    />
    <current-chat
      v-else
      :size="props.size"
    />
    <div
      v-if="isChatActive"
      class="chat-messaging-text-entry"
    >
      <wt-textarea
        ref="message-draft"
        v-model="chat.draft"
        class="chat-messaging__textarea"
        :placeholder="t('workspaceSec.chat.draftPlaceholder')"
        autoresize
        name="draft"
        @enter="sendMessage"
        @paste="handleFilePaste"
      />
      <div class="chat-messaging-text-entry__actions">
        <div class="file-input-wrapper">
          <wt-rounded-action
            class="rounded-action-file-input"
            color="secondary"
            icon="attach"
            :size="props.size"
            rounded
            wide
            @click="triggerAttachmentInput"
          />
          <input
            ref="attachment-input"
            class="rounded-action-file-input__input"
            type="file"
            multiple
            @change="handleAttachments"
          >
        </div>
        <chat-emoji
          :size="props.size"
          @insert-emoji="insertEmoji"
        />
        <wt-rounded-action
          icon="chat-send"
          color="accent"
          :size="props.size"
          rounded
          wide
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed, inject, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import insertTextAtCursor from 'insert-text-at-cursor';
import { useHotkeys } from '../../../../../../hotkeys/useHotkeys.js';
import { useDropzone } from '../../../../../../composibles/useDropzone.js';
import CurrentChat from './current-chat/current-chat.vue';
import ChatHistory from './chat-history/the-chat-history.vue';
import ChatEmoji from './components/chat-emoji.vue';
import HotkeyAction from '../../../../../../hotkeys/HotkeysActiom.enum.js';
import Dropzone from '../../../../../../../app/components/utils/dropzone.vue';

const store = useStore();
const { t } = useI18n();
const eventBus = inject('$eventBus');

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
    default: {}
  },
});

const chatNamespace = 'features/chat';

const hotkeyUnsubscribers = ref([])

const attachmentInput = useTemplateRef('attachment-input')

const {
  isDropzoneVisible,
  handleDragEnter,
  handleDragLeave
} = useDropzone();

const chat = computed(() => store.getters[`${chatNamespace}/CHAT_ON_WORKSPACE`])
const isChatActive = computed(() => store.getters[`${chatNamespace}/IS_CHAT_ACTIVE`])

const send = (message) => store.dispatch(`${chatNamespace}/SEND`, message);
const sendFile = (files) => store.dispatch(`${chatNamespace}/SEND_FILE`, files);
const accept = () => store.dispatch(`${chatNamespace}/ACCEPT`);

const triggerAttachmentInput = () => {
  attachmentInput.value.click();
}

const insertEmoji = (unicode) => { ///gthtdbhsns
  const messageDraft = ref('message-draft')
  // view-source:https://bl.ocks.org/nolanlawson/raw/4f13bc639cdb3483efca8b657f30a1e0/
  const textarea = messageDraft.value.querySelector('textarea');
  insertTextAtCursor(textarea, unicode);
}

const sendMessage = async () => {
  const { draft } = chat.value;
  try {
    chat.value.draft = '';
    await send(draft);
  } catch {
    chat.value.draft = draft;
    eventBus.$emit('notification', {
      type: 'error',
      text: t('error.general'),
    });
  }
}

const setupHotkeys = () => {
  const subscribers = [
    {
      event: HotkeyAction.ACCEPT,
      callback: accept,
    },
  ];
  hotkeyUnsubscribers.value = useHotkeys(subscribers);
}

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files);
  sendFile(files);
  handleDragLeave();
}

const handleFilePaste = (event) => {
  const files = Array
  .from(event.clipboardData.items)
  .map((item) => item.getAsFile())
  .filter((item) => !!item);
  if (files.length) {
    sendFile(files);
    event.preventDefault();
  }
}

const handleAttachments = async (event) => {
  const files = Array.from(event.target.files);
  await sendFile(files);
}

onMounted(() => {
  setupHotkeys();
})

onUnmounted(() => {
  hotkeyUnsubscribers.value.forEach((unsubscribe) => unsubscribe());
})

</script>

<style lang="scss" scoped>
$chatGap: var(--spacing-2xs);
$roundedAction: calc(var(--rounded-action-padding)*2 + var(--rounded-action-border-size)*2);
$textEntryActionsMd: calc(var(--icon-md-size) + $roundedAction);
$textEntryActionsSm: calc(var(--icon-sm-size) + $roundedAction);

.chat-messaging {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: $chatGap;

  &--md {
    .chat-messaging__textarea {
      max-height: calc((100% - $textEntryActionsMd) - $chatGap);
    }
  }
  &--sm {
    .chat-messaging__textarea {
      max-height: calc((100% - $textEntryActionsSm) - $chatGap);
    }
  }
}

.chat-messaging-text-entry {
  display: flex;
  flex-direction: column;
  gap: $chatGap;
  max-height: 50%;

  &__actions {
    display: flex;
    gap: $chatGap;
  }
}

.file-input-wrapper {
  position: relative;
  width: 100%;

  .rounded-action-file-input__input {
    position: absolute;
    width: 0;
    height: 0;
    visibility: hidden;
  }
}
</style>
