<template>
  <article class="chat-history">
    ТРАМПАМПАМ!
    <p> Chat History Empty Component </p>
  </article>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  // size: {
  //   type: String,
  //   default: 'md',
  // },
});

const store = useStore();
const { t } = useI18n();
// const mode = ref(ContactMode.VIEW);
// const namespace = 'ui/infoSec/client/contact';
// const workspaceState = computed(() => store.getters['workspace/WORKSRACE_STATE']);
// const isTaskActive = computed(() => store.getters['workspace/IS_TASK_ACTIVE']);
//
// const taskId = computed(() => {
//   switch (workspaceState) {
//     case WorkspaceStates.CHAT: return props.task.conversationId;
//     case WorkspaceStates.CALL: return props.task.id;
//     default: return null;
//   }
// });
//
// const changeMode = (newMode) => {
//   mode.value = newMode;
// };
//
// function initializeContact() {
//   return store.dispatch(`${namespace}/INITIALIZE_CONTACT`);
// }
//
// function loadContact(contactId) {
//   return store.dispatch(`${namespace}/LOAD_CONTACT`, contactId);
// }
//
// function openView(open, mode) {
//   open();
//   changeMode(mode);
// }
//
// /*
//   we need to watch both for task itself and for task.contactId, because we want to handle 2 cases:
//   1. contactId appears after linking contact to task => we need to load this contact
//   2. task is changes => we need to reset contact
//
//   but we need to prevent both of these cases handlers fire at one time because if task changes, task.contactId changes too
//   so there would be 2 calls of loadContact() and initializeContact() at one time
//  */
//
// watch([() => taskId.value, () => props.task.contactId], ([taskId, contactId], [prevTaskId, prevContactId]) => {
//
//   if (taskId !== prevTaskId || !taskId) {
//     changeMode(ContactMode.VIEW);
//     initializeContact();
//     return;
//   }
//
//   if (taskId === prevTaskId && contactId !== prevContactId) {
//     if (contactId) {
//       loadContact(contactId);
//       changeMode(ContactMode.VIEW);
//     }
//   }
// }, { immediate: true });
</script>

<style lang="scss" scoped>
</style>
