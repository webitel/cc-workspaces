<template>
  <section class="empty-workspace">
    <div class="empty-workspace__content-wrap">
      <img
        class="workspace-pic"
        src="../../../assets/operator-workspace/ws-empty.svg"
        alt="workspace is empty"
      >
      <h1 class="empty-workspace__heading">There are currently no calls or chats</h1>
      <p class="empty-workspace__text">Please wait! Have a nice work!</p>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'empty-workspace',
  };
</script>

<style lang="scss" scoped>
  .empty-workspace {
    height: 100%;

    .empty-workspace__content-wrap {
      text-align: center;
      position: relative;
      top: 50%;
      display: block;
      margin: auto;
      transform: translateY(-50%);
    }

    &__heading {
      @extend .typo-heading-sm;
      margin-top: calcVH(20px);
    }

    &__text {
      @extend .typo-body-sm;
      margin-top: calcVH(10px);
    }
  }

  .workspace-pic {
    width: calcVH(180px);
    height: calcVH(133px);
    display: block;
    margin: auto;
  }
</style>
