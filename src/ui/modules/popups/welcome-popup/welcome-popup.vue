<template>
  <wt-popup size="sm" @close="close">
    <template #title>
      {{ $t('welcomePopup.title') }}
    </template>
    <template #main>
      <p>{{ $t('welcomePopup.subtitle') }}</p>
      <div class="welcome-popup-permission">
        <div class="welcome-popup-permission__status">
          <wt-icon icon="mic"></wt-icon>
          {{ $t('welcomePopup.mic.status') }}:
          <wt-indicator
            :color="mic.status ? 'success' : 'error'"
            size="sm"
          ></wt-indicator>
        </div>
        <p
          v-if="mic.message"
          class="welcome-popup-permission__detail"
        >
          {{ $t(`welcomePopup.mic.message.${mic.message}`) }}
        </p>
      </div>
      <div class="welcome-popup-permission">
        <div class="welcome-popup-permission__status">
          <wt-icon icon="bell"></wt-icon>
          {{ $t('welcomePopup.notifications.status') }}:
          <wt-indicator
            :color="notification.status ? 'success' : 'error'"
            size="sm"
          ></wt-indicator>
        </div>
        <p
          v-if="notification.message"
          class="welcome-popup-permission__detail"
        >
          {{ $t(`welcomePopup.notifications.message.${notification.message}`) }}
        </p>
      </div>
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

<script>
import silenceSound from './assets/audio/silence.mp3';

export default {
  name: 'WelcomePopup',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mic: {
      status: false,
      message: '',
    },
    notification: {
      status: false,
      message: '',
    },
  }),
  created() {
    this.initWindowKeyPressListener();
    this.checkPermissions();
  },
  unmounted() {
    this.removeWindowKeyPressListener();
  },
  methods: {
    playSilence() {
      // https://webitel.atlassian.net/browse/WTEL-4389
      const silence = new Audio(silenceSound);
      silence.play();
    },
    close() {
      if (!this.loading) {
        this.playSilence();
        this.$emit('input');
      };
    },
    async checkMic() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mic.status = true;
      } catch (err) {
        this.mic.status = false;
        if (err.message.includes('Permission denied')) this.mic.message = 'denied';
        else if (err.message.includes('Requested device not found')) this.mic.message = 'notFound';
      }
    },
    async checkNotifications() {
      try {
        const status = await window.Notification.requestPermission();

        if (status === 'granted') {
          this.notification.status = true;
        } else {
          this.notification.status = false;
          this.notification.message = 'denied';
        }
      } catch (err) {
        this.notification.status = false;
        this.notification.message = err;
      }
    },
    checkPermissions() {
      this.checkMic();
      this.checkNotifications();
    },
    handleKeyPress(e) {
      if (e.keyCode === 13 // enter
        || e.key === ' '
        || e.code === 'Space'
        || e.keyCode === 32) { // space
        this.close();
      }
    },
    initWindowKeyPressListener() {
      window.addEventListener('keypress', this.handleKeyPress);
    },
    removeWindowKeyPressListener() {
      window.removeEventListener('keypress', this.handleKeyPress);
    },
  },
};
</script>

<style lang="scss" scoped>
.welcome-popup-permission {
  &__status {
    display: flex;
    align-items: center;
    margin: var(--spacing-xs) 0;
    gap: var(--spacing-2xs);
  }

  &__detail {
    @extend %typo-body-2;
    color: var(--text-error-color);
  }
}
</style>
