<template>
  <div class="call-preview-wrap">
    <div class="call-preview">
      <call-profile></call-profile>
      <div class="call-preview__actions">
        <button class="call-preview__action">Accept</button>
        <button class="call-preview__action">Decline</button>
      </div>
    </div>
  </div>
</template>

<script>
  import CallProfile from './call-profile.vue';

  export default {
    name: 'call-preview',
    components: {
      CallProfile,
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
