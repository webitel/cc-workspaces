<template>
<!--  v-show instead of v-if: https://my.webitel.com/browse/WTEL-2827 -->
  <wt-popup v-show="isDisconnectPopup" class="disconnect-popup" size="sm" @close="closePopup">
    <template #title>{{ $t('disconnectPopup.title') }}</template>
    <template #main>
      <article class="disconnect-popup__main">
        <img
          class="disconnect-popup__img"
          src="../assets/disconnect-popup-animation.svg"
          alt="disconnect pic"
        >
        <p class="disconnect-popup__main__text">{{ $t('disconnectPopup.mainText') }}</p>
      </article>
    </template>
    <template #actions>
      <wt-button ref="jest" color="success" @click="reloadPage">
        {{ $t('disconnectPopup.reloadBtn') }}
      </wt-button>
      <wt-button color="secondary" @click="closePopup">
        {{ $t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script>
import { mapActions,mapState } from 'vuex';

import disconnectSound from '../../../../../features/modules/global-handlers/assets/disconnect-sound.mp3';

// HOW TO TEST DISCONNECT: await cli.socket.close(3001)
export default {
  name: 'DisconnectPopup',
  data: () => ({
    audio: null,
  }),
  computed: {
    ...mapState('features/globals', {
      isDisconnectPopup: (state) => state.isDisconnectPopup,
    }),
  },
  watch: {
    isDisconnectPopup: {
      handler(newVal) {
        if (newVal) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      },
    },
  },
  created() {
    this.audio = new Audio(disconnectSound);
    this.audio.loop = true;
  },
  methods: {
    ...mapActions('features/globals', {
      closePopup: 'CLOSE_DISCONNECT_POPUP',
    }),
    reloadPage() {
      this.$router.go(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.disconnect-popup__main {
  text-align: center;
}
.disconnect-popup__main__text {
  @extend %typo-body-1;
  text-align: center;
}

.disconnect-popup__img {
  width: 180px;
  height: 180px;
  margin: var(--spacing-sm);
}
</style>
