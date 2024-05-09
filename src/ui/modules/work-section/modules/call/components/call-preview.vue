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
          icon="call-transfer--filled"
          color="transfer"
          rounded
          wide
          @click="openTransfer"
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
  import PreviewProfile from './call-preview-profile.vue';
  import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
  import { useHotkeys } from '../../../../../hotkeys/useHotkeys';

  export default {
    name: 'call-preview',
    mixins: [sizeMixin],
    components: {
      PreviewProfile,
    },

    data: () => ({
      unsubscribers: [],
    }),

    methods: {
      ...mapActions('features/call', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
      }),

      openTransfer() {
        this.$emit('transfer');
      },
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
          {
            event: HotkeyAction.TRANSFER,
            callback: this.openTransfer,
          },
        ];
        this.unsubscribers = useHotkeys(subscribers);
      },
    },

    mounted() {
      this.setupHotkeys();
    },

    unmounted() {
      this.unsubscribers.forEach((unsubscribe) => unsubscribe())
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

    &--md {
      .call-preview-wrap {
        width: 100%;
      }
    }
  }
</style>
