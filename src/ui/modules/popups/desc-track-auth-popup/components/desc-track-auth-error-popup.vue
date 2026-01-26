<template>
  <wt-popup
    class="desc-track-auth-error-popup"
    :closable="false"
    size="sm"
  >
    <template #title>
      {{ $t('descTrackAuthPopup.title') }}
    </template>
    <template #main>
      <div class="desc-track-auth-error-popup__image">
        <img
          :src="darkMode ? DescTrackAuthErrorDark : DescTrackAuthError"
          :alt="$t('descTrackAuthPopup.title')"
        >
      </div>
      <div class="desc-track-auth-error-popup__label typo-subtitle-1">
        <span>{{ $t('descTrackAuthPopup.errorLabel') }}</span>
      </div>
      <div class="desc-track-auth-error-popup__description typo-body-1">
        <span>{{ $t('descTrackAuthPopup.errorDescription') }}</span>
      </div>
    </template>
    <template #actions>
      <wt-button
        color="secondary"
        @click="refreshAgentState"
      >{{ $t('reusable.refresh') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import DescTrackAuthError from '../assets/desc-track-auth-error.svg'
import DescTrackAuthErrorDark from '../assets/desc-track-auth-error-dark.svg'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);

const refreshAgentState = () => {
  store.dispatch('ui/infoSec/agentInfo/LOAD_STATUS')
}
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.desc-track-auth-error-popup__image {
  width: 200px;
  margin-inline: auto;
}

.desc-track-auth-error-popup__label {
  color: var(--text-error-color);
  text-align: center;
}

.desc-track-auth-error-popup__description {
  text-align: center;
}
</style>