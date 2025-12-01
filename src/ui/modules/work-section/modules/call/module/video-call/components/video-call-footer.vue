<template>
  <call-footer
    :size="size"
    :current-tab="currentTab"
  >
    <template #numpad>
      <wt-rounded-action
        :size="size"
        class="call-action"
        :icon="!isVideoMuted ? 'video-cam' : 'video-cam-off'"
        rounded
        wide
        @click="toggleVideo"
      />
    </template>
    <template #hold>
      <!-- Empty slot override so call-action buttons from CallFooter are not shown -->
      <div
        class="video-call__bridge-placeholder"
        aria-hidden="true"
      ></div>
    </template>
  </call-footer>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { useStore } from 'vuex'
import { computed } from 'vue';

import callFooter from '../../../components/call-footer.vue';

interface Props {
  size?: ComponentSize
  currentTab?: string
}
withDefaults(defineProps<Props>(), {
  size: ComponentSize.MD,
})

const store = useStore()

const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE'])
const isVideoMuted = computed(() => call.value.mutedVideo)
const toggleVideo = (event) => store.dispatch('features/call/videoCall/TOGGLE_VIDEO', event)
</script>

<style lang="scss" scoped>
</style>
