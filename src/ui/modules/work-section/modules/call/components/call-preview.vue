<template>
  <div class="call-preview-wrap">
    <div class="call-preview">
      <preview-profile/>
      <div class="call-preview__actions">
        <wt-rounded-action
          icon="call"
          color="success"
          rounded
          wide
          @click="answer"
        ></wt-rounded-action>
        <wt-rounded-action
          icon="call-transfer"
          color="transfer"
          rounded
          wide
          @click="openTransfer"
        ></wt-rounded-action>
        <wt-rounded-action
          icon="call-end"
          color="danger"
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
  import PreviewProfile from './call-preview-profile.vue';

  export default {
    name: 'call-preview',
    components: {
      PreviewProfile,
    },

    methods: {
      ...mapActions('features/call', {
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

    .wt-rounded-action {
      margin: 0 15px;
    }
  }
</style>
