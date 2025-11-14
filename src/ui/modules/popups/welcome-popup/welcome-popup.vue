<template>
  <wt-popup size="sm" @close="close">
    <template #title>
      {{ $t('welcomePopup.title') }}
    </template>

    <template #main>
      <p>{{ $t('welcomePopup.subtitle') }}</p>

      <template v-if="permissions.length">
        <div class="welcome-popup-permission"
             v-for="permission in permissions"
             :key="permission.id"
        >
          <div class="welcome-popup-permission__status">
            <div
              class="welcome-popup-permission__status-content"
              :class="{ 'welcome-popup-permission__status-content--disabled': permission.disabled }"
            >
              <wt-icon :icon="permission.icon"></wt-icon>
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
              @update:model-value="(val) => permission.handleToggle(val)"
            />
          </div>
          <p v-if="permission.message" class="welcome-popup-permission__detail">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import silenceSound from './assets/audio/silence.mp3';

const { t } = useI18n()

const props = defineProps({
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['input']);

type Permission = {
  id: 'mic' | 'notifications' | 'camera';
  status: boolean;
  message: string;
  icon: string;
  disabled?: boolean;
  toggle?: boolean;
  enabled?: boolean;
  handleToggle?: (value: boolean) => void;
};

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
  handleToggle: handleCameraToggle
})

const permissions = computed<Permission[]>(() => [mic.value, notification.value, camera.value])

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

async function requestMicPermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    mic.value.status = true;
    mic.value.message = '';
  } catch (err) {
    mic.value.status = false;
    const msg = err?.message || '';
    if (msg.includes('Permission denied')) mic.value.message = 'denied';
    else if (msg.includes('Requested device not found')) mic.value.message = 'notFound';
    else mic.value.message = '';
  }
}

async function requestNotificationPermission() {
  try {
    const status = await window.Notification.requestPermission();
    if (status === 'granted') {
      notification.value.status = true;
      notification.value.message = '';
    } else {
      notification.value.status = false;
      notification.value.message = 'denied';
    }
  } catch (err) {
    notification.value.status = false;
    notification.value.message = 'denied';
  }
}

async function requestCameraAccess() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    camera.value.status = true;
    camera.value.message = '';
  } catch (err) {
    camera.value.status = false;
    const name = err?.name || '';
    const msg = err?.message || '';

    if (name === 'NotAllowedError' || msg.includes('Permission denied')) {
      camera.value.message = 'denied';
    } else if (name === 'NotFoundError' || msg.includes('Requested device not found')) {
      camera.value.message = 'notFound';
    } else {
      camera.value.message = '';
    }
  }
}

function handleCameraToggle(value: boolean) {
  camera.value.enabled = value;
  camera.value.disabled = !value;

  if (value) {
    requestCameraAccess();
  } else {
    camera.value.status = false;
    camera.value.message = '';
  }
}

async function syncCameraPermissionState() {
  if (!('permissions' in navigator)) return;

  const result = await navigator.permissions.query({ name: 'camera' as any });

  const deniedPermission = result.state === 'denied'
  if (result.state === 'granted' || deniedPermission) {
    camera.value.status = !deniedPermission;
    camera.value.message = deniedPermission ? 'denied' : '';
    camera.value.enabled = true;
    camera.value.disabled = false;
  } else {
    camera.value.status = false;
    camera.value.message = '';
    camera.value.enabled = false;
    camera.value.disabled = true;
  }
}

function initPermissionChecks() {
  requestMicPermission();
  requestNotificationPermission();
  syncCameraPermissionState()
}

function handleKeyPress(e) {
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
