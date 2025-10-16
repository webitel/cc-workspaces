<template>
  <div
    v-clickaway="closePicker"
    class="chat-emoji"
  >
    <wt-rounded-action
      :size="size"
      color="secondary"
      icon="chat-emoji"
      rounded
      wide
      @click="toggleEmojiPicker"
    ></wt-rounded-action>
    <div
      v-show="isOpened"
      ref="emojiPickerWrapper"
      class="chat-emoji__wrapper"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import { Picker } from 'emoji-picker-element';
import { useI18n } from 'vue-i18n';
import { ComponentSize } from '@webitel/ui-sdk/enums';

const emit = defineEmits(['insert-emoji']);

const props = defineProps({
  size: {
    type: String,
    default: ComponentSize.MD,
  },
});

const { locale, tm } = useI18n();
const eventBus = inject('$eventBus');

const picker = ref({});
const isOpened = ref(false);
const emojiPickerWrapper = ref(null);

const initPicker = () => {
  // https://github.com/nolanlawson/emoji-picker-element#javascript-api
  picker.value = new Picker({
    i18n: tm('emojiPicker'),
  });
  appendPicker();
};

const appendPicker = () => {
  emojiPickerWrapper.value.appendChild(picker.value);
};

const emitEmojiClickEvent = (event) => {
  const { unicode } = event.detail;
  emit('insert-emoji', unicode);
};

const closePicker = () => {
  isOpened.value = false;
};

const toggleEmojiPicker = () => {
  isOpened.value = !isOpened.value;
  eventBus.$emit('chat-input-focus');
};

onMounted(() => {
  initPicker();
  picker.value.addEventListener('emoji-click', emitEmojiClickEvent);
});

onUnmounted(() => {
  picker.value.removeEventListener('emoji-click', emitEmojiClickEvent);
});
</script>

<style lang="scss" scoped>
$input-height: 48px; // https://webitel.atlassian.net/browse/WTEL-6149 (comments)

.chat-emoji {
  width: 100%;
  position: relative;

  ::v-deep emoji-picker {
    --background: var(--content-wrapper-color);
    --border-color: var(--secondary-color);

    position: absolute;
    z-index: var(--ws-dropdown-z-index);
    bottom: calc(100% + $input-height);
    left: 100%;
    transform: translateX(-50%);
  }
}
</style>
