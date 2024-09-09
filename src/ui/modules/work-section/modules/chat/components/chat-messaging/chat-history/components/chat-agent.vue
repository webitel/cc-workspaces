<template>
  <article class="chat-agent">
    <wt-avatar size="xs" />
    <p> {{ name }} </p>
  </article>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    require: true,
  },
});

</script>

<style lang="scss" scoped>

.chat-agent {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xs);

  p {
    @extend %typo-caption;
  }
}

</style>
