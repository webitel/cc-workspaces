<template>
  <ul class="chat-helper-list">
    <li
      v-for="(item, idx) in props.list"
      :key="item.id || idx"
      class="chat-helper-list__item"
      @click="select(item)"
    >
      <wt-divider
        v-if="idx"
      />

      <div
        :ref="el => setItemRef(el, idx)"
        :class="{ 'chat-helper--active': idx === activeIndex }"
        class="chat-helper"
        @mouseenter="() => activeIndex = idx"
        @mouseleave="() => activeIndex = -1">
        <p class="chat-helper__name">{{ item.name }}</p>
        <p class="chat-helper__text">{{ item.text }}</p>
      </div>
    </li>
  </ul>

</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { ChatHelperItem } from "../types/ChatHelperItem.types";

const props = defineProps<{
  list: ChatHelperItem[];
}>();

const activeIndex = ref(-1);

const itemRefs = ref<HTMLElement[]>([]);

const emit = defineEmits<{
  select: [item: ChatHelperItem]
}>();

const select = (item) => {
  emit('select', item);
};

const setItemRef = (el: HTMLElement | null, index: number) => {
  if (el) itemRefs.value[index] = el;
};

const moveDown = () => {
  // If click on the arrow down we assign the value +1
  if (activeIndex.value < props.list.length - 1) {
    return activeIndex.value += 1;
  }
};

const moveUp = () => {
  // If no item is active, set the first one as active
  if(activeIndex.value === -1) {
    return activeIndex.value = 0;
    // If click on the arrow up we assign the value -1
  } else if(activeIndex.value > 0) {
    return activeIndex.value -= 1;
  }
};

const selectItem = () => {
  if(activeIndex.value >= 0 && activeIndex.value < props.list.length) {
    select(props.list[activeIndex.value]);
  }
}

const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowUp':
      moveUp();
      break;
    case 'Enter':
      selectItem();
      break;
  }
  event.preventDefault();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
})

watch(() => activeIndex.value, (newIndex) => {
  // Scroll to the active item if we use arrow down key
  const el = itemRefs.value[newIndex ?? -1];
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }
});

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
}

.chat-helper {
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs);

  &__name {
    @extend %typo-body-1-bold;
  }

  &--active {
    background-color: var(--content-wrapper-hover-color);
    border-radius: var(--border-radius);
    cursor: pointer;
  }
}
</style>
