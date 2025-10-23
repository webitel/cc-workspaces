<template>
  <call-preview
    v-if="isPreviewCall"
    :size="size"
    @transfer="openTransfer"
  ></call-preview>

  <task-container v-else>
    <template #header>
      <call-header
        :current-tab="currentTab"
        :size="size"
        @open-tab="openTabs"
      ></call-header>
    </template>
    <template #body>
      <component
        :is-active="isActive"
        :is="currentComponent"
        :size="size" />
    </template>

    <template #footer>
      <call-footer
        :current-tab="currentTab"
        :size="size"
        @open-tab="currentTab = $event"
      ></call-footer>
    </template>
  </task-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue';
import { useStore } from 'vuex';

import { ComponentSize } from '@webitel/ui-sdk/enums';

import isIncomingRinging from '../../../../../../features/modules/call/scripts/isIncomingRinging';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import History from '../../_shared/components/workspace-history/components/history-container.vue';
import Contacts from './call-contacts/call-contacts-container.vue';
import CallFooter from './call-footer.vue';
import CallHeader from './call-header.vue';
import Bridge from './call-merge/call-bridge-container.vue';
import Numpad from './call-numpad/numpad.vue';
import CallPreview from './call-preview.vue';
import Transfer from './call-transfer/the-call-transfer.vue';
import { CallTab } from '../enums/CallTab.enum';

// Component mapping
const callTabComponents = {
  [CallTab.Numpad]: Numpad,
  [CallTab.Contacts]: Contacts,
  [CallTab.History]: History,
  [CallTab.Transfer]: Transfer,
  [CallTab.Bridge]: Bridge,
};

const props = defineProps({
  size: {
    type: ComponentSize,
    default: ComponentSize.MD,
  },
});

const store = useStore();

const currentTab = ref(CallTab.Numpad);
const isPreviewTransfer = ref(false);
const hotkeyUnsubscribers = ref([]);
//variable to check if the component is active
const isActive = ref(false);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const isPreviewCall = computed(() => {
  if (isPreviewTransfer.value) return false;
  return isIncomingRinging(call.value);
});

// Computed property to get the actual component
const currentComponent = computed(() => callTabComponents[currentTab.value]);

const openTransfer = () => {
  isPreviewTransfer.value = true;
  currentTab.value = CallTab.Transfer;
};

const openCall = () => {
  isPreviewTransfer.value = false;
  currentTab.value = CallTab.Numpad;
};

const openTabs = (tab) => currentTab.value = currentTab.value === tab ? CallTab.Numpad : tab;

const setupHotkeys = () => {
  const subscribers = [
    {
      event: HotkeyAction.TRANSFER,
      callback: () => {
        isPreviewTransfer.value ? openCall() : openTransfer();
      },
    },
  ];
  hotkeyUnsubscribers.value = useHotkeys(subscribers);
};

watch(call, () => {
  openCall();
});

onMounted(() => {
  setupHotkeys();
});

onUnmounted(() => {
  hotkeyUnsubscribers.value.forEach((unsubscribe) => unsubscribe());
});

onActivated(() => {
  isActive.value = true;
});

onDeactivated(() => {
  isActive.value = false;
});
</script>

<style lang="scss" scoped>

</style>
