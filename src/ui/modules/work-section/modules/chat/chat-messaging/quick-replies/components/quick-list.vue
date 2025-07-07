<template>
  <ul
    class="quick-list"
    @close="close">
    <li
      v-for="(item, idx) in props.list"
      :key="item.id || idx"
      class="quick-list__item"
      @click="select(item)"
    >
      <wt-divider
        v-if="idx"
      />

      <div class="quick-list-wrapper">
        <p class="quick-list-wrapper__name">{{ item.name }}</p>
        <p class="quick-list-wrapper__text">{{ item.text }}</p>
      </div>
    </li>
  </ul>
</template>
<script setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select', 'close']);

const select = (item) => {
  emit('select', item);
};

const close = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.quick-list {
  @extend %wt-scrollbar;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);


  &_item {
    :hover {
      background-color: var(--content-wrapper-hover-color);
      border-radius: var(--border-radius);
      cursor: pointer;
    }
  }
}

.quick-list-wrapper {
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs);

  &__name {
    @extend %typo-body-1-bold;
  }
}
</style>
