<template>
  <task-footer>
    <wt-rounded-action
      v-if="!isVideoCall"
      :active="isOnNumpad"
      :size="size"
      class="call-footer-action"
      color="secondary"
      icon="numpad"
      rounded
      wide
      @click="$emit('openTab', CallTab.Numpad)"
    />
    <wt-rounded-action
      v-if="!isVideoCall"
      :active="isOnHold"
      :class="{
          'hidden': !isHold,
          'hold': isOnHold,
        }"
      :color="isOnHold ? 'hold' : 'secondary'"
      :size="size"
      class="call-footer-action"
      icon="hold"
      rounded
      wide
      @click="toggleHold"
    />
    <wt-rounded-action
      :active="isOnMuted"
      :class="{
          'hidden': !isMuted,
        }"
      :icon="isOnMuted ? 'mic-muted' : 'mic'"
      :size="size"
      class="call-footer-action call-footer-action__mic"
      color="secondary"
      rounded
      wide
      @click="toggleMute"
    />
    <wt-rounded-action
      v-if="isVideoCall"
      :size="size"
      class="call-footer-action"
      :icon="isVideoMuted ? 'video-cam-off' : 'video-cam'"
      rounded
      wide
      @click="toggleVideo"
    />
  </task-footer>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, withDefaults } from 'vue';
import { useStore } from 'vuex';

import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import TaskFooter from '../../_shared/components/task-footer/task-footer.vue';
import { CallTab } from '../enums/CallTab.enum';
import { ComponentSize } from '@webitel/ui-sdk/enums';

const props = withDefaults(
	defineProps<{
		currentTab?: string;
		size?: ComponentSize;
	}>(),
	{
		currentTab: CallTab.Numpad,
		size: ComponentSize.MD,
	},
);

const store = useStore();

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);
const isVideoCall = computed(
	() => store.getters['features/call/videoCall/IS_VIDEO_CALL'],
);

const isOnNumpad = computed(() => props.currentTab === CallTab.Numpad);
const isOnMuted = computed(() => call.value?.muted);
const isOnHold = computed(() => call.value?.isHold);

const isMuted = computed(() => !isNewCall.value);
const isHold = computed(() => !isNewCall.value);

const isVideoMuted = computed(() => call.value?.mutedVideo);

const toggleMute = () => store.dispatch('features/call/TOGGLE_MUTE');
const toggleHold = () => store.dispatch('features/call/TOGGLE_HOLD');
const toggleVideo = () =>
	store.dispatch('features/call/videoCall/TOGGLE_VIDEO');

const hotkeyUnsubscribers = ref([]);

const setupHotkeys = () => {
	hotkeyUnsubscribers.value = useHotkeys([
		{
			event: HotkeyAction.MUTE,
			callback: toggleMute,
		},
		{
			event: HotkeyAction.HOLD,
			callback: toggleHold,
		},
	]);
};

onMounted(setupHotkeys);

onUnmounted(() => {
	hotkeyUnsubscribers.value.forEach((unsubscribe) => unsubscribe());
});
</script>

<style lang="scss" scoped>
</style>

