<template>
  <call-preview
    v-if="isPreviewCall"
    :size="size"
  />
  <task-container v-else>
    <template #header>
      <call-header
        :current-tab="currentTab"
        :size="size"
        @open-tab="openTab"
      />
    </template>
    <template #body>
      <component
        :is="currentComponent"
        :is-active="isActive"
        :size="props.size" />
    </template>

    <template #footer>
      <call-footer
        :current-tab="currentTab"
        :size="props.size"
      ></call-footer>
    </template>
  </task-container>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, onActivated, onDeactivated, ref, watch } from 'vue';
import { useStore } from 'vuex';

import isIncomingRinging from '../../../../../../../../features/modules/call/scripts/isIncomingRinging';
import TaskContainer from '../../../../_shared/components/task-container/task-container.vue';
import History from '../../../../_shared/components/workspace-history/components/history-container.vue';
import Contacts from '../../../../call/components/call-contacts/call-contacts-container.vue';
import CallFooter from './../../../components/call-footer.vue';
import CallHeader from './../../../components/call-header.vue';
import CallPreview from '../../../components/call-preview.vue';
import { VideoCallTab } from '../enums/VideoCallTab.enum';
import VideoCallChat from '../module/chat/components/the-video-call-chat.vue';
import CallState from '../../../components/call-state.vue';

interface Props {
	size?: ComponentSize;
}
// Component mapping
const videoCallTabComponents = {
	[VideoCallTab.State]: CallState,
	[VideoCallTab.Contacts]: Contacts,
	[VideoCallTab.History]: History,
	[VideoCallTab.Chat]: VideoCallChat,
};

const props = withDefaults(defineProps<Props>(), {
	size: ComponentSize.MD,
});

const store = useStore();

const currentTab = ref(VideoCallTab.State);
const isActive = ref(false);

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const videoCallChat = computed(
	() => store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT'],
);

const isPreviewCall = computed(() => {
	return isIncomingRinging(call.value);
});

const currentComponent = computed(
	() => videoCallTabComponents[currentTab.value],
);

const openCall = () => {
	currentTab.value = VideoCallTab.State;
};

const openTab = (tab) =>
	(currentTab.value = currentTab.value === tab ? VideoCallTab.State : tab);

watch(
	[
		call,
		videoCallChat,
	],
	([isCall, isVideoChat]) => {
		if (isCall) {
			openCall();
		}

		if (isVideoChat) {
			openTab(VideoCallTab.Chat);
		}
	},
	{
		immediate: true,
	},
);

onActivated(() => {
	isActive.value = true;
});

onDeactivated(() => {
	isActive.value = false;
});
</script>

<style lang="scss" scoped>

</style>
