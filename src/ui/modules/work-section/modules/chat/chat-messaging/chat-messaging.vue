<template>
  <div
    class="chat-messaging"
    :class="[
      `chat-messaging--${size}`,
    ]"
    @dragenter.prevent="handleDragEnter"
  >
    <dropzone
      v-if="isDropzoneVisible && !showQuickReplies"
      @dragenter.prevent
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
    />
    <wt-replace-transition appear>
      <chat-history
        v-if="contact?.id && !showQuickReplies"
        :contact="contact"
        :size="size"
      />
      <current-chat
        v-else-if="!showQuickReplies"
        :size="size"
      />
      <quick-replies
        v-else
        :search="searchReply"
        @close="closeQuickRepliesPanel"
        @select="applyQuickReply"
      />
    </wt-replace-transition>


    <div
      v-if="isChatActive"
      class="chat-messaging-text-entry"
    >

      <chat-helper-list
        v-if="isOpenAutocomplete"
        :list="autocompleteList"
        class="chat-messaging-helper-list"
        @select="selectAutocompleteOption"
      />

      <wt-textarea
        ref="messageDraft"
        :value="chat.draft"
        class="chat-messaging__textarea"
        :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
        autoresize
        name="draft"
        @enter="sendMessage"
        @paste="handleFilePaste"
        @keydown="onKeyDown"
        @input="inputMessage"
        @blur="showQuickReplies && onBlur()"
      />
      <div class="chat-messaging-text-entry__actions">
        <div class="chat-messaging-file-input-wrapper">
          <wt-rounded-action
            class="chat-messaging-file-input"
            color="secondary"
            icon="attach"
            :size="size"
            rounded
            wide
            @click="attachmentInput?.click()"
          />
          <input
            ref="attachmentInput"
            class="chat-messaging-file-input__input"
            type="file"
            multiple
            @change="handleAttachments"
          >
        </div>
        <chat-emoji
          :size="size"
          @insert-emoji="insertEmoji"
        />
        <wt-rounded-action
          icon="quick-replies"
          color="accent"
          :size="size"
          rounded
          wide
          @click="handleQuickReplies"
        />
        <wt-rounded-action
          icon="chat-send"
          color="accent"
          :size="size"
          rounded
          wide
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WebitelContactsContact } from '@webitel/api-services/gen';
import {ComponentSize} from '@webitel/ui-sdk/enums';
import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';
import insertTextAtCursor from 'insert-text-at-cursor';
import {computed, inject, nextTick,onMounted, onUnmounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useStore} from 'vuex';

import Dropzone from '../../../../../../app/components/utils/dropzone.vue';
import {useDropzoneHandlers} from '../../../../../composibles/useDropzoneHandlers';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import {useHotkeys} from '../../../../../hotkeys/useHotkeys';
import {useAutocomplete} from './autocomplete/composables/useAutocomplete';
import {AutocompleteOptions} from './autocomplete/enums/AutocompleteOptions';
import ChatHistory from './chat-history/the-chat-history.vue';
import ChatEmoji from './components/chat-emoji.vue';
import ChatHelperList from './components/chat-helper-list.vue';
import CurrentChat from './current-chat/current-chat.vue';
import {useQuickReplies} from './quick-replies/composables/useQuickReplies';
import QuickReplies from './quick-replies/quick-replies.vue';

const props = withDefaults(defineProps<{
  size?: string;
  contact?: WebitelContactsContact,
  showQuickReplies?: boolean;
}>(), {
  size: ComponentSize.MD,
  showQuickReplies: false,
  contact: undefined,
});

const emit = defineEmits<{
  handleQuickReplies: [boolean];
}>();

const { t } = useI18n();
const eventBus = inject('$eventBus');
const store = useStore();

const messageDraft = ref();
const attachmentInput = ref();
const textarea = ref();

const chat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);
const isChatActive = computed(() => store.getters['features/chat/IS_CHAT_ACTIVE']);

const autocompleteOptions = computed(() => [{
  name: t('autocompleteList.quickReplies'),
  text: t('autocompleteList.quickRepliesDescription'),
  id: AutocompleteOptions.QUICK_REPLIES,
}]);

const {
  isDropzoneVisible,
  handleDragEnter,
  handleDragLeave
} = useDropzoneHandlers();

const {
  isOpenAutocomplete,
  autocompleteList,

  onInput: onAutocompleteInput,
  onKeyDown,
  onBlur,
  close: closeAutocomplete
} = useAutocomplete(autocompleteOptions);

const {
  search: searchReply,

  open: openQuickReplies,
  close: closeQuickReplies,
  select: selectQuickReply,
  input: inputQuickReply,
} = useQuickReplies({ emit, variables: chat.value.variables });

const hotkeyUnsubscribers = ref([]);

function sendFile (files) {
  return store.dispatch('features/chat/SEND_FILE', files);
}

function send (draft) {
  return store.dispatch('features/chat/SEND', draft);
}

function accept() {
  return store.dispatch('features/chat/ACCEPT');
}

function setDraftFocus() {
  if(!messageDraft.value || !textarea.value) return;
  textarea?.value.focus();
}

function insertEmoji(unicode: string) {
  // view-source:https://bl.ocks.org/nolanlawson/raw/4f13bc639cdb3483efca8b657f30a1e0/
  insertTextAtCursor(textarea.value, unicode);
}

async function sendMessage() {
  const draft = chat.value.draft;
  try {
    chat.value.draft = '';
    await send(draft);
  } catch {
    chat.value.draft = draft;
    eventBus?.$emit('notification', {type: 'error', text: t('error.general')});
  }
}

function setupHotkeys() {
  hotkeyUnsubscribers.value = useHotkeys([{event: HotkeyAction.ACCEPT, callback: accept}]);
}

function handleDrop(event: DragEvent) {
  const files = Array.from(event.dataTransfer?.files);
  sendFile(files);
  handleDragLeave();
}

function handleFilePaste(event: ClipboardEvent) {
  const files = Array.from(event.clipboardData?.items)
    .map(item => item.getAsFile())
    .filter(Boolean);
  if (files.length) {
    sendFile(files);
    event.preventDefault();
  }
}

async function handleAttachments(event: Event) {
  const files = Array.from(event.target.files);
  await sendFile(files);
}

function closeQuickRepliesPanel() {
  if (searchReply.value && !chat.value.draft) chat.value.draft = searchReply.value;
  closeQuickReplies();
}

function applyQuickReply({ text }) {
  const replacedText = selectQuickReply(text);
  chat.value.draft = chat.value.draft ? `${chat.value.draft} ${replacedText}` : replacedText;
  setDraftFocus();
}

function selectAutocompleteOption({id}: { id: string }) {
  switch (id) {
    case AutocompleteOptions.QUICK_REPLIES:
      showQuickRepliesPanel();
      break;
      default: console.warn(`Unknown autocomplete option selected: ${id}`);
  }
}

function showQuickRepliesPanel() {
  closeAutocomplete();
  chat.value.draft = chat.value.draft.slice(0, -1);
  openQuickReplies();
}

function inputMessage(text: string) {
  if(props.showQuickReplies) {
    inputQuickReply({text, draft: chat.value.draft});
  } else {
    chat.value.draft = text;
  }
  onAutocompleteInput(text);
}

function handleQuickReplies() {
  return props.showQuickReplies ? closeQuickReplies() : openQuickReplies();
}

watch(chat, async () => {
  await nextTick();
  setDraftFocus();
}, {immediate: true});

onMounted(() => {
  eventBus?.$on('chat-input-focus', setDraftFocus);
  setupHotkeys();

  if (messageDraft.value && messageDraft.value.$el) {
    textarea.value = messageDraft.value.$el.querySelector('textarea');
  }
});

onUnmounted(() => {
  eventBus?.$off('chat-input-focus', setDraftFocus);
  hotkeyUnsubscribers.value.forEach((unsubscribe) => unsubscribe());
});
</script>

<style lang="scss" scoped>
$chatGap: var(--spacing-2xs);
$roundedAction: calc(var(--rounded-action-padding) * 2 + var(--rounded-action-border-size) * 2);
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
  position: relative;

  &__actions {
    display: flex;
    gap: $chatGap;
  }
}

.chat-messaging-file-input-wrapper {
  position: relative;
  width: 100%;
}

.chat-messaging-file-input__input {
  position: absolute;
  width: 0;
  height: 0;
  visibility: hidden;
}

.chat-messaging-helper-list {
  position: absolute;
  bottom: 100%;
  width: 100%;
}
</style>
