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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDevicesList, usePermission } from '@vueuse/core';
import { usePermissionDevice } from './composable/usePermissionDevice';
import { Permission, PermissionId, PermissionMessage } from './types/permissions.types';
import silenceSound from './assets/audio/silence.mp3';


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
  icon,
  disabled: false,
  toggle: false,
  enabled: undefined,
  handleToggle: undefined,
  ...overrides,
});

const {
  setupMediaPermissionWatch,
  setPermission,
  applyNotificationPermissionState,
  applyToggleState
} = usePermissionDevice()

const applyNotificationState = (state: NotificationPermission | null): void => {
  applyNotificationPermissionState({ target: notification, state });
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

const microphonePermissionState = usePermission('microphone');
const cameraPermissionState = usePermission('camera');
const notificationPermissionState = usePermission('notifications');

const microphone = ref<Permission>(createPermission(PermissionId.Microphone, 'mic'));
const notification = ref<Permission>(createPermission(PermissionId.Notifications, 'bell'));

const camera = ref<Permission>(createPermission(PermissionId.Camera, 'video-cam'));

const handleCameraToggle = async (value: boolean): Promise<void> => {
  applyToggleState({
    target: camera,
    enabled: value,
    onDisable: { status: false },
  });
  if (!value) {
    setPermission({ target: camera, payload: { status: false } });
    return;
  }

  const granted = await ensureCameraPermissions();

  if (!granted) {
    setPermission({
      target: camera,
      payload: { status: false, message: PermissionMessage.Denied },
    });
    return;
  }

  const hasDevices = cameraPermissionGranted.value || videoInputs.value.length;

  setPermission({
    target: camera,
    payload: {
      status: hasDevices,
      message: hasDevices ? undefined : PermissionMessage.NotFound,
    },
  });
};

camera.value = createPermission(PermissionId.Camera, 'video-cam', {
  disabled: true,
  toggle: true,
  enabled: false,
  handleToggle: handleCameraToggle,
});

const permissions = computed<Permission[]>(() => [
  microphone.value,
  notification.value,
  camera.value,
]);

watch(notificationPermissionState, (state) => applyNotificationState(state), { immediate: true });

setupMediaPermissionWatch({
  permissionState: microphonePermissionState,
  permissionGranted: micPermissionGranted,
  devices: audioInputs,
  target: microphone,
});

setupMediaPermissionWatch({
  permissionState: cameraPermissionState,
  permissionGranted: cameraPermissionGranted,
  devices: videoInputs,
  target: camera,
  controlToggleAvailability: true,
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
