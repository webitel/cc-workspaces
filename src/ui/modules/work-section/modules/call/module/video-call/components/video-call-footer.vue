<template>
  <call-footer
    :size="size"
    :current-tab="currentTab"
  >
      <template #before-mute-micro>
      <wt-rounded-action
        :size="size"
        class="call-action"
        :icon="!isVideoMuted ? 'video-cam' : 'video-cam-off'"
        rounded
        wide
        @click="toggleVideo"
      ></wt-rounded-action>
    </template>
  </call-footer>
</template>

<script setup lang="ts">
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { useStore } from 'vuex'
import { computed } from 'vue';

import callFooter from '../../../components/call-footer.vue';

const store = useStore()

defineProps({
  size: {
    type: String,
    default: ComponentSize.MD,
  },
  currentTab: {
    type: String,
  },
})

const toggleVideo = (event) => store.dispatch('features/call/videoCall/TOGGLE_VIDEO', event)
const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE'])

const isVideoMuted = computed(() => call.value.mutedVideo)
</script>

<style lang="scss" scoped>
</style>
