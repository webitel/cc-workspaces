<template>
  <section class="post-processing-wrapper">
    <header>
      <slot name="header">
        <h1 class="post-processing-wrapper__title">
          <slot name="title"></slot>
        </h1>
      </slot>
    </header>
    <article class="post-processing-wrapper__main"
             :class="`post-processing-wrapper__main--${color}`">
      <slot name="main"></slot>
    </article>
    <footer class="post-processing-wrapper__footer">
      <slot name="actions"></slot>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'post-processing-wrapper',
  props: {
    color: {
      type: String,
      default: 'success',
    },
  },
};
</script>

<style lang="scss" scoped>
.post-processing-wrapper {
  --form-min-width: 350px;
  --form-max-width: 450px;
  --success-form-box-shadow: 0 0 40px rgba(76, 175, 80, 0.3);
  --failure-form-box-shadow: 0 0 40px rgba(255, 68, 68, 0.3);

  min-width: var(--form-min-width);
  max-width: var(--form-max-width);
  margin: auto;

  .post-processing-wrapper__title {
    @extend %typo-heading-2;
    text-align: center;
    max-width: 80%;
    margin: 45px auto;
  }

  .post-processing-wrapper__main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    border-radius: var(--border-radius);

    &--success {
      box-shadow: var(--success-form-box-shadow);
    }

    &--failure {
      box-shadow: var(--failure-form-box-shadow);
    }
  }

  .post-processing-wrapper__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 45px 0;
  }
}
</style>
