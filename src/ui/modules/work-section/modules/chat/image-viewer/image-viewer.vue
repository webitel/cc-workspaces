<template>
  <aside v-show="isImageView" class="image-viewer" @click="close">
    <div class="image-viewer__shadow"></div>
    <div class="image-viewer__content-wrapper">
      <img class="image-viewer__content__img" :src="photo.url" :alt="photo.name">
    </div>
  </aside>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
	name: 'ImageViewer',
	// not "MediaViewer" because of using vidstack:  vidstack reserves all component starts with "media-"
	computed: {
		...mapState('features/chat/chatMedia', {
			imageView: (state) => state.mediaView,
		}),
		photo() {
			if (!this.isImageView) return {};
			return this.imageView.file;
		},
		isImageView() {
			return !!this.imageView;
		},
	},
	methods: {
		...mapActions('features/chat/chatMedia', {
			close: 'CLOSE_MEDIA',
		}),
	},
};
</script>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--ws-media-viewer-z-index);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer__shadow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--wt-popup-shadow-color);
}

.image-viewer__content-wrapper {
  position: relative;
  z-index: 1;
}

.image-viewer__content__img {
  // like on web telegram preview
  display: block;
  max-width: 100vw;
  max-height: 90vh;
  object-fit: contain;
  margin: auto;
}
</style>
