<template>
  <ul
    class="chat-helper-list"
    @close="close">
    <li
      v-for="(item, idx) in props.list"
      :key="item.id || idx"
      class="chat-helper-list__item"
      @click="select(item)"
    >
      <wt-divider
        v-if="idx"
      />

      <div class="chat-helper">
        <p class="chat-helper__name">{{ item.name }}</p>
        <p class="chat-helper__text">{{ item.text }}</p>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { ChatHelperItem} from "../types/ChatHelperItem.types";


const props = defineProps<{
  list: ChatHelperItem[];
}>();

const emit = defineEmits<{
  (e: 'select', item: ChatHelperItem): void;
}>();

const select = (item) => {
  emit('select', item);
};
</script>

<style lang="scss" scoped>
.chat-helper-list {
  @extend %wt-scrollbar;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background-color: var(--content-wrapper-color);

  &__item {
    :hover {
      background-color: var(--content-wrapper-hover-color);
      border-radius: var(--border-radius);
      cursor: pointer;
    }
  }
}

.chat-helper {
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs);

  &__name {
    @extend %typo-body-1-bold;
  }
}
</style>
