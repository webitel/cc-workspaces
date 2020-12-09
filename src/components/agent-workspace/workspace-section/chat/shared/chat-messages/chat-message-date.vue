<template>
  <div class="chat-message-date">{{ messageDate }}</div>
</template>

<script>
export default {
  name: 'chat-message-date',
  props: {
    time: {
      type: Number,
    },
  },
  computed: {
    messageDate() {
      const options = { day: 'numeric', month: 'long' };
      return new Date(this.time).toLocaleDateString([], options);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-date {
  @extend %typo-strong-sm;
  text-align: center;
  margin: 30px 0;
  color: var(--text-outline-color);
}
</style>
