<template>
  <call-preview
    v-if="isPreviewCall"
    :size="size"
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
import { ref, computed, watch, onActivated, onDeactivated } from 'vue';
import { useStore } from 'vuex';

import { ComponentSize } from '@webitel/ui-sdk/enums';

import isIncomingRinging from '../../../../../../features/modules/call/scripts/isIncomingRinging';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import History from '../../_shared/components/workspace-history/components/history-container.vue';
import Contacts from '../../call/components/call-contacts/call-contacts-container.vue';
import CallFooter from './video-call-footer.vue';
import CallHeader from './video-call-header.vue';
import CallPreview from './video-call-preview.vue';
import VideoCallProcessing from './video-call-processing.vue';
import { VideoCallTab } from '../enums/VideoCallTab.enum.ts';

// Component mapping
const callTabComponents = {
  [VideoCallTab.Processing]: VideoCallProcessing,
  [VideoCallTab.Contacts]: Contacts,
  [VideoCallTab.History]: History,
};

const props = defineProps({
  size: {
    type: ComponentSize,
    default: ComponentSize.MD,
  },
});

const store = useStore();

const currentTab = ref(VideoCallTab.Processing);
//variable to check if the component is active
const isActive = ref(false);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const isPreviewCall = computed(() => {
  return isIncomingRinging(call.value);
});

// Computed property to get the actual component
const currentComponent = computed(() => callTabComponents[currentTab.value]);


const openCall = () => {
  currentTab.value = VideoCallTab.Processing;
};


const openTabs = (tab) => currentTab.value = currentTab.value === tab ? VideoCallTab.Processing : tab;


watch(call, () => {
  openCall();
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
