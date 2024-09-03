<template>
  <article class="chat-history">
    <p> Chat History Empty Component </p>
  </article>
</template>

<script setup>

import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const { t } = useI18n();

const namespace = 'features/chat/chatHistory';

const contactID = computed(() => store.state.ui.infoSec.client.contact.contact?.id);
const messages = computed(() => store.getters[`${namespace}/ALL_CONTACTS_MESSAGES`]);
const loadMessages = async () => {
  await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, contactID.value);
}

watch(contactID, loadMessages, { immediate: true });

</script>

<style lang="scss" scoped>

.chat-history {
  display: flex;
  overflow: hidden;
  flex-direction: column;
}

.chat-messages-items {
  @extend %wt-scrollbar;
  box-sizing: border-box;
  flex: 1 1;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
}

</style>
