<template>
  <wt-popup v-if="isDisconnectPopup" class="disconnect-popup" min-width="480" @close="closePopup">
    <template slot="title">{{ $t('disconnectPopup.title') }}</template>
    <template slot="main">
      <article class="disconnect-popup__main">
        {{ $t('disconnectPopup.mainText') }}

      </article>
    </template>
    <template slot="actions">
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'disconnect-popup',
  computed: {
    ...mapState('globals', {
      isDisconnectPopup: (state) => state.isDisconnectPopup,
    }),
  },
  methods: {
    ...mapActions('globals', {
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
</style>
