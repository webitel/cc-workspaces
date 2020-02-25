<template>
  <div class="call-preview-wrap">
    <div class="call-preview">
      <call-profile></call-profile>
      <div class="call-preview__actions">
        <rounded-action
          class="call-preview__action"
          @click.native="answer()"
        >Accept
        </rounded-action>
        <rounded-action
          class="call-preview__action"
          @click.native="transfer()"
        >Transfer
        </rounded-action>
        <rounded-action
          class="call-preview__action"
          @click.native="hangup()"
        >Reject
        </rounded-action>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import CallProfile from './call-profile.vue';
  import callInfo from '../../../../mixins/callInfoMixin';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-preview',
    mixins: [callInfo],
    components: {
      CallProfile,
      RoundedAction,
    },

    methods: {
      ...mapActions('operator', {
        answer: 'ANSWER',
        transfer: 'TRANSFER',
        hangup: 'HANGUP',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .call-preview-wrap {
    position: relative;
    min-height: 100%;
    height: 100%;
    width: 100%;
    background: rgba(121, 113, 2, 0.1);
  }

  .call-preview {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .call-preview__actions {
    display: flex;

    .call-preview__action {
      margin: 0 20px;
    }
  }
</style>
