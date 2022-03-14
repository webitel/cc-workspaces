<template>
  <aside class="media-viewer" v-show="isMediaView" @click="close">
    <div class="media-viewer__shadow"></div>
    <div class="media-viewer__content-wrapper">
      <img class="media-viewer__content__img" :src="photo.url" :alt="photo.name">
    </div>
  </aside>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'media-viewer',
  computed: {
    ...mapState('chat', {
      mediaView: (state) => state.mediaView,
    }),
    photo() {
      if (!this.isMediaView) return {};
      return this.mediaView.file;
    },
    isMediaView() {
      return !!this.mediaView;
    },
  },
  methods: {
    ...mapActions('chat', {
      close: 'CLOSE_MEDIA',
    }),
  },
};
</script>

<style lang="scss" scoped>
.media-viewer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-viewer__shadow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--main-primary-accent-color);
  opacity: var(--popup-shadow-opacity);
  z-index: 0;
}

.media-viewer__content-wrapper {
  position: relative;
  z-index: 1;
}

.media-viewer__content__img {
  // like on web telegram preview
  display: block;
  max-width: 100vw;
  max-height: 90vh;
  object-fit: contain;
  margin: auto;
}
</style>
