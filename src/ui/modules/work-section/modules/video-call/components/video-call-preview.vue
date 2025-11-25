<template>
  <div
    :class="[
      `call-preview--${size}`,
    ]"
    class="call-preview"
  >
    <div class="call-preview-wrap">
      <preview-profile/>
      <div class="call-preview__actions">
        <wt-rounded-action
          :size="size"
          icon="call--filled"
          color="success"
          rounded
          wide
          @click="answer"
        ></wt-rounded-action>
        <wt-rounded-action
          :size="size"
          icon="call-end--filled"
          color="error"
          rounded
          wide
          @click="hangup"
        ></wt-rounded-action>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  import sizeMixin from '../../../../../../app/mixins/sizeMixin';
  import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
  import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
  import PreviewProfile from './video-call-preview-profile.vue';

  export default {
    name: 'CallPreview',
    components: {
      PreviewProfile,
    },
    mixins: [sizeMixin],

    data: () => ({
      hotkeyUnsubscribers : [],
    }),

    methods: {
      ...mapActions('features/call', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
      }),
      setupHotkeys() {
        const subscribers = [
          {
            event: HotkeyAction.ACCEPT,
            callback: this.answer,
          },
          {
            event: HotkeyAction.END,
            callback: this.hangup,
          },
        ];
        this.hotkeyUnsubscribers  = useHotkeys(subscribers);
      },
    },

    mounted() {
      this.setupHotkeys();
    },

    unmounted() {
      this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe())
    },
  };
</script>

<style lang="scss" scoped>
  .call-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .call-preview__actions {
      display: flex;
      gap: var(--spacing-2xs);
    }

    .call-preview-wrap {
      max-width: 100%;
    }

    &--md {
      .call-preview-wrap {
        width: 100%;
      }
    }
  }
</style>
