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
      >
        <template #bridge >
          <!-- Empty slot override so call-action buttons from CallHeader are not shown -->
          <div
            class="video-call__bridge-placeholder"
            aria-hidden="true"
          ></div>
        </template>
        <template #transfer >
          <!-- Empty slot override so call-action buttons from CallHeader are not shown -->
          <div
            class="video-call__transfer-placeholder"
            aria-hidden="true"
          ></div>
        </template>
      </call-header>
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
      ></call-footer>
    </template>
  </task-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onActivated, onDeactivated } from 'vue';
import { useStore } from 'vuex';

import { ComponentSize } from '@webitel/ui-sdk/enums';

import isIncomingRinging from '../../../../../../../../features/modules/call/scripts/isIncomingRinging';
import TaskContainer from '../../../../_shared/components/task-container/task-container.vue';
import History from '../../../../_shared/components/workspace-history/components/history-container.vue';
import Contacts from '../../../../call/components/call-contacts/call-contacts-container.vue';
import CallFooter from './../../../components/call-footer.vue';
import CallHeader from './../../../components/call-header.vue';
import CallPreview from '../../../components/call-preview.vue';
import VideoCallState from './video-call-state.vue';
import { VideoCallTab } from '../enums/VideoCallTab.enum.ts';

interface Props {
  size?: ComponentSize
}
// Component mapping
const videoCallTabComponents = {
  [VideoCallTab.Processing]: VideoCallState,
  [VideoCallTab.Contacts]: Contacts,
  [VideoCallTab.History]: History,
};

const props = withDefaults(defineProps<Props>(), {
  size: ComponentSize.MD
})

const store = useStore();

const currentTab = ref(VideoCallTab.Processing);
const isActive = ref(false);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);

const isPreviewCall = computed(() => {
  return isIncomingRinging(call.value);
});

const currentComponent = computed(() => videoCallTabComponents[currentTab.value]);


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
