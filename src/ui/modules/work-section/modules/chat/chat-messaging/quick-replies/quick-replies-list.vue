<template>
  <ul class="quick-replies-list">
    <li
      v-for="(reply, idx) in props.replies"
      :key="reply.id"
      class="quick-replies-list__item"
      @click="select(reply.text)"
    >
      <wt-divider
        v-if="idx"
      />

      <div class="quick-replies">
        <p class="quick-replies__name">{{ reply.name }}</p>
        <p class="quick-replies__text">{{ reply.text }}</p>
      </div>
    </li>

  </ul>
</template>
<script setup>
const props = defineProps({
  replies: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select']);

const select = (text) => {
  emit('select', text);
};
</script>

<style lang="scss" scoped>
.quick-replies-list {
  @extend %wt-scrollbar;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);


  &__item {
    :hover {
      background-color: var(--content-wrapper-hover-color);
      border-radius: var(--border-radius);
      cursor: pointer;
    }
  }
}

.quick-replies {
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs);

  &__name {
    @extend %typo-body-1-bold;
  }
}
</style>
