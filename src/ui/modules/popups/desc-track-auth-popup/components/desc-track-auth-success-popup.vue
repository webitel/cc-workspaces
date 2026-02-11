<template>
  <wt-popup
    v-if="modelShown"
    class="desc-track-auth-success-popup"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ $t('descTrackAuthPopup.title') }}
    </template>
    <template #main>
      <div class="desc-track-auth-success-popup__image">
        <img
          :src="darkMode ? DescTrackAuthSuccessDark : DescTrackAuthSuccess"
          :alt="$t('descTrackAuthPopup.title')"
        >
      </div>
      <div class="desc-track-auth-success-popup__label typo-subtitle-1">
        <span>{{ $t('descTrackAuthPopup.successLabel') }}</span>
      </div>
      <div class="desc-track-auth-success-popup__description typo-body-1">
        <span>{{ $t('descTrackAuthPopup.successDescription') }}</span>
      </div>
    </template>
    <template #actions>
      <wt-button
        color="secondary"
        @click="close"
      >{{ $t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { computed, defineModel, ref } from 'vue';
import { useStore } from 'vuex';
import DescTrackAuthSuccess from '../assets/desc-track-auth-success.svg';
import DescTrackAuthSuccessDark from '../assets/desc-track-auth-success-dark.svg';

const store = useStore();

const modelShown = defineModel<boolean>('shown', {
	required: true,
});

const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);

const close = () => {
	modelShown.value = false;
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.desc-track-auth-success-popup__image {
  width: 200px;
  margin-inline: auto;
}

.desc-track-auth-success-popup__label {
  color: var(--text-success-color);
  text-align: center;
}

.desc-track-auth-success-popup__description {
  text-align: center;
}
</style>