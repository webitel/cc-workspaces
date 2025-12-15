<template>
  <wt-popup size="sm" @close="close">
    <template #title>
      {{ $t('welcomePopup.title') }}
    </template>

    <template #main>
      <p>{{ $t('welcomePopup.subtitle') }}</p>

      <div v-if="permissions.length" class="welcome-popup">
        <div
          v-for="permission in permissions"
          :key="permission.id"
          class="welcome-popup__item"
        >
          <div class="welcome-popup__status">
            <div
              class="welcome-popup__status-content"
              :class="{
                'welcome-popup__status-content--disabled': permission.disabled,
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
              class="welcome-popup__switcher"
              :model-value="permission.enabled"
              @update:model-value="permission.handleToggle?.($event)"
            />
          </div>

          <p v-if="permission.message" class="welcome-popup__detail">
            {{ t(`welcomePopup.${permission.id}.message.${permission.message}`) }}
          </p>
        </div>
      </div>
    </template>

    <template #actions>
      <wt-button wide :loading="loading" @click="close">
        {{ $t('reusable.ok') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDevicesList, usePermission } from '@vueuse/core';
import silenceSound from './assets/audio/silence.mp3';
import { Permission, PermissionId, PermissionMessage } from './types/permissions.types';

const { t } = useI18n();

const props = defineProps({
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['input']);

const createPermission = (
  id: PermissionId,
  icon: string,
  overrides: Partial<Permission> = {},
): Permission => ({
  id,
  status: false,
  message: PermissionMessage.None,
  icon,
  disabled: false,
  toggle: false,
  enabled: undefined,
  handleToggle: undefined,
  ...overrides,
});

const setPermission = (
  target: Ref<Permission>,
  status: boolean,
  message: PermissionMessage = PermissionMessage.None,
): void => {
  target.value.status = status;
  target.value.message = message;
};

const applyNotificationState = (state: NotificationPermission | null): void => {
  if (state === 'granted') return setPermission(notification, true);
  if (state === 'denied') return setPermission(notification, false, PermissionMessage.Denied);
  setPermission(notification, false);
};

const requestNotificationPermission = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  try {
    const status = await window.Notification.requestPermission();
    applyNotificationState(status);
  } catch {
    applyNotificationState('denied');
  }
};

const applyMediaPermissionState = (
  target: Ref<Permission>,
  isGranted: boolean,
  isDenied: boolean,
  hasDevices: boolean,
): void => {
  let message = PermissionMessage.None;

  if (isDenied) {
    message = PermissionMessage.Denied;
  } else if (isGranted && !hasDevices) {
    message = PermissionMessage.NotFound;
  }

  setPermission(target, isGranted && hasDevices, message);
};

const setupMediaPermissionWatch = ({
 permissionState,
 permissionGranted,
 devices,
 target,
 withToggle = false,
}: {
  permissionState: Ref<PermissionState | undefined>;
  permissionGranted: Ref<boolean>;
  devices: Ref<MediaDeviceInfo[]>;
  target: Ref<Permission>;
  withToggle?: boolean;
}) => {
  watch(
    [permissionState, permissionGranted, devices],
    ([state, granted, inputs]) => {
      if (!state) return;

      const isGranted = state === 'granted';
      const isDenied = state === 'denied';
      const hasDevices = granted || inputs.length > 0;

      if (withToggle) {
        const isKnownState = isGranted || isDenied;
        target.value.enabled = isKnownState;
        target.value.disabled = !isKnownState;
      }

      applyMediaPermissionState(target, isGranted, isDenied, hasDevices);
    },
    { immediate: true },
  );
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

const mic = ref<Permission>(createPermission(PermissionId.Mic, 'mic'));
const notification = ref<Permission>(createPermission(PermissionId.Notifications, 'bell'));

const camera = ref<Permission>(createPermission(PermissionId.Camera, 'video-cam'));

const handleCameraToggle = async (value: boolean): Promise<void> => {
  camera.value.enabled = value;
  camera.value.disabled = !value;

  const granted = value ? await ensureCameraPermissions() : false;

  if (!value) {
    setPermission(camera, false);
    return;
  }

  if (!granted) {
    setPermission(camera, false, PermissionMessage.Denied);
    return;
  }

  const hasDevices = cameraPermissionGranted.value || videoInputs.value.length > 0;
  setPermission(
    camera,
    hasDevices,
    hasDevices ? PermissionMessage.None : PermissionMessage.NotFound,
  );
};

camera.value = createPermission(PermissionId.Camera, 'video-cam', {
  disabled: true,
  toggle: true,
  enabled: false,
  handleToggle: handleCameraToggle,
});

const permissions = computed<Permission[]>(() => [
  mic.value,
  notification.value,
  camera.value,
]);

watch(notificationPermissionState, (state) => applyNotificationState(state), { immediate: true });

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

const initPermissionChecks = async (): Promise<void> => {
  await ensureMicPermissions();
  await requestNotificationPermission();
};

const playSilence = (): void => {
  // https://webitel.atlassian.net/browse/WTEL-4389
  const silence = new Audio(silenceSound);
  silence.play?.();
};

const close = (): void => {
  if (props.loading) return;
  playSilence();
  emit('input');
};

const handleKeyPress = (e: KeyboardEvent): void => {
  if (
    e.keyCode === 13 || // Enter
    e.key === ' ' ||
    e.code === 'Space' ||
    e.keyCode === 32 // Space
  ) {
    close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
  initPermissionChecks();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>
