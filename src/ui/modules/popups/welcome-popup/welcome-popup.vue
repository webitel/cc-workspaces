<template>
  <wt-popup size="sm" @close="close">
    <template #title>
      {{ $t('welcomePopup.title') }}
    </template>

    <template #main>
      <p>{{ $t('welcomePopup.subtitle') }}</p>

      <template v-if="permissions.length">
        <div
          class="welcome-popup"
          v-for="permission in permissions"
          :key="permission.id"
        >
          <div class="welcome-popup__status">
            <div
              class="welcome-popup__status-content"
              :class="{
                'welcome-popup__status-content--disabled':
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
              class="welcome-popup--enabled"
              :model-value="permission.enabled"
              @update:model-value="permission?.handleToggle"
            />
          </div>

          <p
            v-if="permission.message"
            class="welcome-popup__detail"
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

  const granted = value ? await ensureCameraPermissions() : false;
  camera.value.message = !granted ? 'denied' : '';
  camera.value.status = false;
}

const permissions = computed<Permission[]>(() => [
  mic.value,
  notification.value,
  camera.value,
]);

function applyNotificationState(state: NotificationPermission | null) {
  if (!state) {
    notification.value.status = false;
    notification.value.message = '';
    return;
  }

  switch (state) {
    case 'granted':
      notification.value.status = true;
      notification.value.message = '';
      break;

    case 'denied':
      notification.value.status = false;
      notification.value.message = 'denied';
      break;

    default:
      notification.value.status = false;
      notification.value.message = '';
  }
}


type MediaPermissionWatchConfig = {
  permissionState: Ref<NotificationPermission | PermissionState | undefined>;
  permissionGranted: Ref<boolean>;
  devices: Ref<MediaDeviceInfo[]>;
  target: Ref<Permission>;
  withToggle?: boolean;
};

function applyMediaPermissionState(
  target: Ref<Permission>,
  { isGranted, isDenied, hasDevices },
) {
  const message =
    isDenied
      ? 'denied'
      : isGranted && !hasDevices
        ? 'notFound'
        : '';

  target.value.status = isGranted && hasDevices;
  target.value.message = message;
}


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
        const isKnownState = isGranted || isDenied;
        target.value.enabled = isKnownState;
        target.value.disabled = !isKnownState;
      }

      applyMediaPermissionState(target, {
        isGranted,
        isDenied,
        hasDevices: granted || inputs.length > 0,
      });
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
  (state) => applyNotificationState(state),
  { immediate: true },
);

  async function requestNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    try {
      const status = await window.Notification.requestPermission();
      applyNotificationState(status);
    } catch {
      applyNotificationState('denied');
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
.welcome-popup {
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
