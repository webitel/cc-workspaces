<template>
  <div class="chat-date">{{ date }}</div>
</template>

<script>
export default {
  name: 'chat-date',
  props: {
    time: {
      type: Number,
      required: true,
    },
  },
  computed: {
    date() {
      const options = { day: 'numeric', month: 'long' };
      return new Date(this.time).toLocaleDateString([], options);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-date {
  @extend %typo-caption;
  text-align: center;
  margin: 30px 0;
  color: var(--text-main-color);
}
</style>
