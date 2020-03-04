<template>
  <div class="call-preview-wrap">
    <div class="call-preview">
      <call-profile></call-profile>
      <div class="call-preview__actions">
        <rounded-action
          class="rounded-action__lg call"
          @click.native="answer()"
        >
          <icon class="lg">
            <svg class="icon icon-call-lg lg">
              <use xlink:href="#icon-call-lg"></use>
            </svg>
          </icon>
        </rounded-action>
        <rounded-action
          class="rounded-action__lg transfer"
          @click.native="transfer()"
        >
          <icon class="lg">
            <svg class="icon icon-call-transfer-lg lg">
              <use xlink:href="#icon-call-transfer-lg"></use>
            </svg>
          </icon>
        </rounded-action>
        <rounded-action
          class="rounded-action__lg end"
          @click.native="hangup()"
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .call-preview__actions {
    display: flex;

    .rounded-action {
      margin: 0 calcRem(15px);
    }
  }
</style>
