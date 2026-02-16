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
          class="welcome-popup-permission__detail typo-body-2"
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
          class="welcome-popup-permission__detail typo-body-2"
        >
          {{ $t(`welcomePopup.notifications.message.${notification.message}`) }}
        </p>
      </div>

      <div class="welcome-popup-permission">
        <div class="welcome-popup-permission__status">
          <wt-icon icon="video-cam"></wt-icon>
          {{ $t('welcomePopup.camera.status') }}:

          <wt-indicator
            :color="camera.status ? 'success' : 'error'"
            size="sm"
          ></wt-indicator>
        </div>
        <p v-if="camera.message" class="welcome-popup-permission__detail typo-body-2">
          {{ $t(`welcomePopup.camera.message.${camera.message}`) }}
        </p>
      </div>
    </template>

    <template #actions>
      <wt-button wide :loading="loading" @click="close">
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
		camera: {
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
			}
		},
		async checkMic() {
			try {
        const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
        stream.getTracks().forEach(track => track.stop());
        this.mic.status = true;
			} catch (err) {
				this.mic.status = false;
				this.mic.message = this.getPermissionErrorMessage(err);
			}
		},
		async requestCameraAccess() {
			try {
        const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
        stream.getTracks().forEach(track => track.stop());
        this.camera.status = true;
			} catch (err) {
				this.camera.status = false;
				this.camera.message = this.getPermissionErrorMessage(err);
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
			this.requestCameraAccess();
		},

		getPermissionErrorMessage(err) {
			if (err?.message?.includes('Requested device not found'))
				return 'notFound';
			return 'denied';
		},

		handleKeyPress(e) {
			if (
				e.keyCode === 13 || // enter
				e.key === ' ' ||
				e.code === 'Space' ||
				e.keyCode === 32
			) {
				// space
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
@use '@webitel/ui-sdk/src/css/main' as *;

.welcome-popup-permission {
  &__status {
    display: flex;
    align-items: center;
    margin: var(--spacing-xs) 0;
    gap: var(--spacing-2xs);
  }

  &__detail {
    color: var(--text-error-color);
  }
}
</style>
