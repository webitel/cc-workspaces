<template>
  <aside class="video-container" :class="{'large': isExpanded}" v-if="isVideo">
    <div class="video-wrap peer">
      <video
        class="peer-video"
        :srcObject.prop="peerStreams[0] || localStreams[0]"
        autoplay
        muted
      ></video>
    </div>

    <div
      class="video-wrap local"
      v-if="this.isLocalVideo && this.isPeerVideo"
    >
      <video
        class="local-video"
        :srcObject.prop="localStreams[0]"
        autoplay
        muted
      ></video>
    </div>
    <button
      class="icon-btn video-action video-action__expand"
      @click.prevent="isExpanded = !isExpanded"
    >
      <icon v-if="isExpanded">
        <svg class="icon xl">
          <use xlink:href="#icon-collapse-xl__bold"></use>
        </svg>
      </icon>
      <icon v-else>
        <svg class="icon md">
          <use xlink:href="#icon-expand-md__bold"></use>
        </svg>
      </icon>
    </button>
    <rounded-action
      class="end video-action video-action__hangup"
      @click.native="hangup"
    >
      <icon>
        <svg class="icon icon-call-end-md md">
          <use xlink:href="#icon-call-end-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <button
      class="icon-btn video-action video-action__mic"
      @click.prevent="toggleMute"
    >
      <icon v-if="isExpanded">
        <svg class="icon xl">
          <use :xlink:href="micIcon"></use>
        </svg>
      </icon>
      <icon v-else>
        <svg class="icon md">
          <use :xlink:href="micIcon"></use>
        </svg>
      </icon>
    </button>
  </aside>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  // import RoundedAction from '../../utils/rounded-action.vue';

  export default {
    name: 'video-container',
    components: {
      // RoundedAction,
    },

    data: () => ({
      isExpanded: false,
    }),

    computed: {
      ...mapState('features/call', {
        call: (state) => state.callOnWorkspace,
      }),

      peerStreams() {
        return this.call.peerStreams || [];
      },

      localStreams() {
        return this.call.localStreams || [];
      },

      isPeerVideo() {
        return this.peerStreams.some((stream) => (
          stream.getTracks().some((track) => track.kind === 'video')
        ));
      },

      isLocalVideo() {
        return this.localStreams.some((stream) => (
          stream.getTracks().some((track) => track.kind === 'video')
        ));
      },

      isVideo() {
        return this.isPeerVideo || this.isLocalVideo;
      },

      // controls Active state
      isOnMuted() {
        return this.call.muted;
      },

      micIcon() {
        return this.isOnMuted ? '#icon-mic-muted-xl__bold' : '#icon-mic-xl__bold';
      },
    },

    methods: {
      ...mapActions('features/call', {
        hangup: 'HANGUP',
        toggleMute: 'TOGGLE_MUTE',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  $video-action-color: #fff;

  .video-container {
    position: fixed;
    right: (30px);
    bottom: (70px);
    border-radius: var(--border-radius);
    z-index: 900;
    overflow: hidden;

    &.large {
      right: 50%;
      bottom: 50%;
      transform: translate(50%, 50%);
    }

    .video-action {
      position: absolute;
      z-index: 10;

      .icon {
        fill: $video-action-color;
        stroke: $video-action-color;
      }

      &__expand {
        top: (30px);
        left: (30px);
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 50%;
        transition: var(--transition);
        cursor: pointer;
      }

      &__hangup {
        top: (30px);
        right: (30px);
      }

      &__mic {
        bottom: (48px);
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .video-wrap {
    line-height: 0; // container larger than video bug

    &.local {
      position: absolute;
      right: (30px);
      bottom: (30px);
      width: fit-content;
      width: -moz-fit-content;
      height: fit-content;
      border: 2px solid var(--accent-color);
      z-index: 2;
    }

    .peer-video {
      width: 100%;
      height: auto;
      max-width: (444px);
      object-fit: cover;
    }

    .local-video {
      width: (60px);
      height: (60px);
      /*width: 13.5%; // 60px from 444px container width*/
      //height: 20.1%; // 60px from 298px container height
      object-fit: cover;
    }
  }

  .video-container.large {
    .peer-video {
      height: auto;
      min-width: 60vw;
      max-width: 90vw;
      max-height: 90vh;
    }

    .local-video {
      width: 15vh;
      height: 15vh;
    }
  }
</style>
