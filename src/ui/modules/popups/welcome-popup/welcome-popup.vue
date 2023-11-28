<template>
  <wt-popup @close="close">
    <template v-slot:title>
      {{ $t('welcomePopup.title') }}
    </template>
    <template v-slot:main>
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
    <template v-slot:actions>
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
export default {
  name: 'welcome-popup',
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
  methods: {
    close() {
      if (!this.loading) this.$emit('input');
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
  created() {
    this.initWindowKeyPressListener();
    this.checkPermissions();
  },
  destroyed() {
    this.removeWindowKeyPressListener();
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
    color: var(--false-color);
  }
}
</style>
