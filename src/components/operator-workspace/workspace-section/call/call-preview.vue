<template>
  <div class="call-preview-wrap">
    <div class="call-preview">
      <div class="call-profile">
        <img class="call-profile__pic" src="https://cs4.pikabu.ru/post_img/2016/05/22/8/1463919617179069423.jpg"
             alt="client photo">
        <div class="call-profile__name">
          {{computeDisplayName}}
        </div>
        <div class="call-profile__number">
          {{computeDisplayNumber}}
        </div>
      </div>
      <div class="call-preview__actions">
        <rounded-action
          class="call-preview__action"
          @click.native="answer(itemIndex)"
        >Accept
        </rounded-action>
        <rounded-action
          class="call-preview__action"
          @click.native="hangup(itemIndex)"
        >Reject
        </rounded-action>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import callInfo from '../../../../mixins/callInfoMixin';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-preview',
    mixins: [callInfo],
    components: {
      RoundedAction,
    },

    computed: {
      ...mapState('operator', {
        itemInstance: (state) => state.openedItem.item,
        itemIndex: (state) => state.openedItem.index,
      }),
    },

    methods: {
      ...mapActions('operator', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
        openCall: 'OPEN_CALL',
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
