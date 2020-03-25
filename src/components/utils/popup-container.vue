<template>
  <div class="popup-container">
    <div class="popup-container__shadow"></div>
    <aside class="popup">
      <header class="popup__header">
        <slot name="popup-header"></slot>
      </header>
      <section class="popup__main">
        <slot name="popup-main"></slot>
      </section>
      <footer class="popup__footer">
        <slot name="popup-footer"></slot>
      </footer>
    </aside>
  </div>
</template>

<script>
  export default {
    name: 'popup-container',
  };
</script>

<style lang="scss" scoped>
  .popup-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 900;

    &__shadow {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $sidebar-bg-color;
      opacity: 0.8;
      z-index: 0;
    }
  }

  .popup {
    @extend .box-shadow;

    position: absolute;
    top: 50%;
    left: 50%;
    max-height: 80vh;
    padding: calcVH(30px) calcVH(20px);
    background: #fff;
    transform: translate(-50%, -50%);
    border-radius: $border-radius;
    overflow-y: auto;
    z-index: 10;
  }

  .popup__main {
    margin: calcVH(30px) 0;
  }

  .popup-actions {
    width: fit-content;
    width: -moz-fit-content;
    margin: auto;
  }
</style>
