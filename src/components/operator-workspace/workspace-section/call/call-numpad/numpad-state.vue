<template>
  <div class="numpad-state">
    <div class="numpad-state__animation">
      <img style="width: 50px; height: 50px; border-radius: 50%;" src="https://static10.tgstat.ru/channels/_0/3b/3bc2c1c682ca9f9517380ce37ad01c75.jpg" alt="">
    </div>
    <div class="numpad-state__primary-text">Ringing</div>
    <div class="numpad-state__secondary-text">Try again</div>
  </div>
</template>

<script>
  export default {
    name: 'numpad-state',
  };
</script>

<style lang="scss" scoped>
  .numpad-state {
    display: flex;
    align-items: center;
    flex-direction: column;

    &__animation {
      flex: 0 0 50px;
      margin-bottom: 10px;
    }

    &__primary-text {
      flex: 0 0 auto;
      min-height: 28px;
      margin-bottom: 25px;
    }

    &__secondary-text {
      flex: 0 0 auto;
      min-height: 16px;
      margin-bottom: 55px;
    }
  }
</style>
