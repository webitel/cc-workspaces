<template>
  <aside class="dropzone dropzone--animated" v-on="$listeners">
    <div class="dropzone__border-animation"></div>
    <article class="dropzone__text-wrapper">
      <h3 class="dropzone__title">{{ $t('workspaceSec.chat.dropzone.title') }}</h3>
      <p class="dropzone__description">{{ $t('workspaceSec.chat.dropzone.description') }}</p>
    </article>
  </aside>
</template>

<script>
export default {
  name: 'Dropzone',
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.dropzone {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--content-wrapper-color);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  z-index: 10;

  &--animated :before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, var(--primary-color) 50%, transparent 50%),
    linear-gradient(90deg, var(--primary-color) 50%, transparent 50%),
    linear-gradient(0deg, var(--primary-color) 50%, transparent 50%),
    linear-gradient(0deg, var(--primary-color) 50%, transparent 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 15px 4px, 15px 4px, 4px 15px, 4px 15px;
    background-position: 0 0, 100% 100%;
    animation: border-dance 6s infinite linear;
    @keyframes border-dance {
      0% {
        background-position: 0 0, 100% 100%, 0 100%, 100% 0;
      }
      100% {
        background-position: 100% 0, 0 100%, 0 0, 100% 100%;
      }
    }
  }
}

.dropzone__text-wrapper {
  max-width: 80%;
}

.dropzone__title {
  @extend %typo-heading-2;
  text-align: center;
}

.dropzone__description {
  @extend %typo-body-2;
  text-align: center;
}
</style>
