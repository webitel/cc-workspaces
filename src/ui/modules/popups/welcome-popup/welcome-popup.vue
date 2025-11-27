<template>
  <wt-popup size="sm" @close="close">
    <template #title>
      {{ $t('welcomePopup.title') }}
    </template>

    <template #main>
      <p>{{ $t('welcomePopup.subtitle') }}</p>

      <template v-if="permissions.length">
        <div
          class="welcome-popup-permission"
          v-for="permission in permissions"
          :key="permission.id"
        >
          <div class="welcome-popup-permission__status">
            <div
              class="welcome-popup-permission__status-content"
              :class="{
                'welcome-popup-permission__status-content--disabled':
                  permission.disabled,
              }"
            >
              <wt-icon :icon="permission.icon" />
              {{ $t(`welcomePopup.${permission.id}.status`) }}:
            </div>

            <wt-indicator
              :color="permission.status ? 'success' : 'error'"
              size="sm"
            />

            <wt-switcher
              v-if="permission.toggle"
              class="welcome-popup-permission__switch"
              :model-value="permission.enabled"
              @update:model-value="(val) => permission.handleToggle?.(val)"
            />
          </div>

          <p
            v-if="permission.message"
            class="welcome-popup-permission__detail"
          >
            {{ t(`welcomePopup.${permission.id}.message.${permission.message}`) }}
          </p>
        </div>
      </template>
    </template>

    <template #actions>
      <wt-button
        wide
        :loading="loading"
        @click="close"
      >
        {{ $t('reusable.ok') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDevicesList, usePermission } from '@vueuse/core';
import silenceSound from './assets/audio/silence.mp3';

const { t } = useI18n();

const props = defineProps({
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['input']);

type PermissionId = 'mic' | 'notifications' | 'camera';

type Permission = {
  id: PermissionId;
  status: boolean;
  message: string;
  icon: string;
  disabled?: boolean;
  toggle?: boolean;
  enabled?: boolean;
  handleToggle?: (value: boolean) => void | Promise<void>;
};

const {
  audioInputs,
  permissionGranted: micPermissionGranted,
  ensurePermissions: ensureMicPermissions,
} = useDevicesList({
  constraints: { audio: true },
  requestPermissions: false,
});

const {
  videoInputs,
  permissionGranted: cameraPermissionGranted,
  ensurePermissions: ensureCameraPermissions,
} = useDevicesList({
  constraints: { video: true },
  requestPermissions: false,
});

const micPermissionState = usePermission('microphone');
const cameraPermissionState = usePermission('camera');
const notificationPermissionState = usePermission('notifications');

const mic = ref<Permission>({
  id: 'mic',
  status: false,
  message: '',
  icon: 'mic',
});

const notification = ref<Permission>({
  id: 'notifications',
  status: false,
  message: '',
  icon: 'bell',
});

const camera = ref<Permission>({
  id: 'camera',
  status: false,
  message: '',
  icon: 'video-cam',
  disabled: true,
  toggle: true,
  enabled: false,
  handleToggle: handleCameraToggle,
});

async function handleCameraToggle(value: boolean) {
  camera.value.enabled = value;
  camera.value.disabled = !value;

  if (value) {
    const granted = await ensureCameraPermissions();
    if (!granted) {
      camera.value.status = false;
      camera.value.message = 'denied';
    }
  } else {
    camera.value.status = false;
    camera.value.message = '';
  }
}

const permissions = computed<Permission[]>(() => [
  mic.value,
  notification.value,
  camera.value,
]);

type MediaPermissionWatchConfig = {
  permissionState: Ref<NotificationPermission | PermissionState | undefined>;
  permissionGranted: Ref<boolean>;
  devices: Ref<MediaDeviceInfo[]>;
  target: Ref<Permission>;
  withToggle?: boolean;
};

function setupMediaPermissionWatch({
 permissionState,
 permissionGranted,
 devices,
 target,
 withToggle = false,
}: MediaPermissionWatchConfig) {
  watch(
    [permissionState, permissionGranted, devices],
    ([state, granted, inputs]) => {
      if (!state) return;

      const isGranted = state === 'granted';
      const isDenied = state === 'denied';

      if (withToggle) {
        if (isGranted || isDenied) {
          target.value.enabled = true;
          target.value.disabled = false;
        } else {
          target.value.enabled = false;
          target.value.disabled = true;
        }
      }

      if (isGranted && (granted || inputs.length > 0)) {
        target.value.status = true;
        target.value.message = '';
      } else if (isDenied) {
        target.value.status = false;
        target.value.message = 'denied';
      } else if (isGranted && inputs.length === 0) {
        target.value.status = false;
        target.value.message = 'notFound';
      } else {
        target.value.status = false;
        target.value.message = '';
      }
    },
    { immediate: true },
  );
}

setupMediaPermissionWatch({
  permissionState: micPermissionState,
  permissionGranted: micPermissionGranted,
  devices: audioInputs,
  target: mic,
});

setupMediaPermissionWatch({
  permissionState: cameraPermissionState,
  permissionGranted: cameraPermissionGranted,
  devices: videoInputs,
  target: camera,
  withToggle: true,
});

watch(
  notificationPermissionState,
  (state) => {
    if (!state) return;

    if (state === 'granted') {
      notification.value.status = true;
      notification.value.message = '';
    } else if (state === 'denied') {
      notification.value.status = false;
      notification.value.message = 'denied';
    } else {
      notification.value.status = false;
      notification.value.message = '';
    }
  },
  { immediate: true },
);

async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  try {
    const status = await window.Notification.requestPermission();
    if (status === 'granted') {
      notification.value.status = true;
      notification.value.message = '';
    } else if (status === 'denied') {
      notification.value.status = false;
      notification.value.message = 'denied';
    } else {
      notification.value.status = false;
      notification.value.message = '';
    }
  } catch {
    notification.value.status = false;
    notification.value.message = 'denied';
  }
}

async function initPermissionChecks() {
  await ensureMicPermissions();
  await requestNotificationPermission();
}
function playSilence() {
  // https://webitel.atlassian.net/browse/WTEL-4389
  const silence = new Audio(silenceSound);
  silence.play?.();
}

function close() {
  if (!props.loading) {
    playSilence();
    emit('input');
  }
}

function handleKeyPress(e: KeyboardEvent) {
  if (
    e.keyCode === 13 || // Enter
    e.key === ' ' ||
    e.code === 'Space' ||
    e.keyCode === 32 // Space
  ) {
    close();
  }
}

function initWindowKeyPressListener() {
  window.addEventListener('keypress', handleKeyPress);
}

function removeWindowKeyPressListener() {
  window.removeEventListener('keypress', handleKeyPress);
}

onMounted(() => {
  initWindowKeyPressListener();
  initPermissionChecks();
});

onUnmounted(() => {
  removeWindowKeyPressListener();
});
</script>

<style lang="scss" scoped>
.welcome-popup-permission {
  &__status {
    display: flex;
    align-items: center;
    margin: var(--spacing-xs) 0;
    gap: var(--spacing-2xs);

    &-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-2xs);

      &--disabled {
        opacity: 0.5;
      }
    }
  }

  &__detail {
    @extend %typo-body-2;
    color: var(--text-error-color);
  }
}
</style>
