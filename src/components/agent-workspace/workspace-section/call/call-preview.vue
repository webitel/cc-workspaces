<template>
  <div class="call-preview-wrap">
    <div class="call-preview">
      <preview-profile/>
      <div class="call-preview__actions">
        <rounded-action
          class="rounded-action__lg call"
          @click.native="answer"
        >
          <icon class="lg">
            <svg class="icon icon-call-lg lg">
              <use xlink:href="#icon-call-lg"></use>
            </svg>
          </icon>
        </rounded-action>
        <rounded-action
          class="rounded-action__lg transfer"
          @click.native="openTransfer"
        >
          <icon class="lg">
            <svg class="icon icon-call-transfer-lg lg">
              <use xlink:href="#icon-call-transfer-lg"></use>
            </svg>
          </icon>
        </rounded-action>
        <rounded-action
          class="rounded-action__lg end"
          @click.native="hangup"
        >
          <icon class="lg">
            <svg class="icon icon-call-end-lg lg">
              <use xlink:href="#icon-call-end-lg"></use>
            </svg>
          </icon>
        </rounded-action>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import PreviewProfile from './call-preview-profile.vue';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-preview',
    components: {
      PreviewProfile,
      RoundedAction,
    },

    methods: {
      ...mapActions('call', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
      }),

      openTransfer() {
        this.$emit('transfer');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .call-preview-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .call-preview__actions {
    display: flex;
    justify-content: space-evenly;

    .rounded-action {
      margin: 0 15px;
    }
  }
</style>
