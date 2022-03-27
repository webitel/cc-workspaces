<template>
  <aside class="wt-player">
    <audio
      id="wt-player__player"
      ref="audio"
      :src="src"
      :autoplay="autoplay"
      controls
      v-on="listeners"
    ></audio>

    <!-- The "wt-icon-btn" component is append in to "audio" element by "setCloseIcon" method-->
    <wt-icon-btn
      class="wt-player__close-icon"
      ref="close-icon"
      icon="close"
      @click="$emit('close')"
    ></wt-icon-btn>
  </aside>
</template>

<script>
import Plyr from 'plyr';

export default {
  name: 'wt-player',
  props: {
    src: {},
    autoplay: {
      type: Boolean,
      default: true,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    download: {
      type: [String, Function, Boolean],
      default: () => (url) => url.replace('/stream', '/download'),
    },
  },
  data: () => ({
    player: null,
  }),

  watch: {
    src() {
      this.setupDownload();
    },
    download() {
      this.setupDownload();
    },
  },

  mounted() {
    this.setupPlayer();
  },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
      };
    },
  },

  methods: {
    setupPlayer() {
      const baseURL = this.$baseURL || process.env.BASE_URL;
      if (this.player) this.player.restart();
      const controls = ['play-large', 'play', 'progress', 'current-time',
        'mute', 'volume', 'captions', 'settings', 'pip',
        'airplay', 'fullscreen'];
      if (this.download) controls.push('download');
      this.player = new Plyr('#wt-player__player', {
        autoplay: this.autoplay,
        loadSprite: false,
        iconUrl: `${baseURL}img/plyr.svg`,
        controls,
        loop: {
          active: this.loop,
        },
      });
      this.appendCloseIcon();
    },
    setupDownload() {
      if (!this.download) this.setupPlayer();
      else if (typeof this.download === 'string') {
        this.player.download = this.download;
      } else if (typeof this.download === 'function') {
        this.player.download = this.download(this.src);
      }
    },
    appendCloseIcon() {
      const plyrControls = this.$refs.audio.plyr?.elements?.controls;
      const closeIcon = this.$refs['close-icon'].$el;
      if (plyrControls) {
        plyrControls.append(closeIcon);
      }
    },
  },
};
</script>

<style lang="scss">
@import "~plyr/src/sass/plyr.scss";

.wt-player {
  @extend %typo-body-md;
  position: sticky;
  bottom: 60px;

  .plyr {
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }

  &__close-icon {
    transform: translate(var(--player-close-icon-transform-translate-x),
      var(--player-close-icon-transform-translate-y));
  }

  .plyr__control:hover, {
    background: var(--main-option-hover-color);
    color: var(--text-primary-color);
  }

  //.plyr__control[role='menuitemradio']::before,
  //.plyr__control[role='menuitemradio']:hover::before {
  //  border: 2px solid var(--main-secondary-color);
  //  background: var(--main-primary-color);
  //}
  //
  //.plyr__control[role='menuitemradio']::after {
  //  background: var(--main-secondary-color);
  //}
}

</style>
