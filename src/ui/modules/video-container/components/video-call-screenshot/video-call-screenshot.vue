<template>
  <!-- Показуємо тільки якщо є src -->
  <div
    v-if="src"
    class="screenshot-box"
    :class="positionClass"
    @click="onZoom"
  >
    <div class="preview-wrapper">
      <img
        class="preview-img"
        :src="src"
        alt="Screenshot preview"
      />

      <!-- Кнопка закриття -->
      <button class="close-btn" @click.stop="onClose">
        <wt-icon icon="close" size="xl" color="light" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  src?: string;
  rightSide?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'zoom'): void;
}>();

const positionClass = computed(() =>
  props.rightSide ? 'right' : 'left',
);

const onClose = () => emit('close');
const onZoom = () => emit('zoom');
</script>

<style scoped lang="scss">
.screenshot-box {
  position: absolute;
  bottom: 16px;

  /* Білий контейнер з тінню як у Figma (WT/ContentWrapper/color + elevation-10) */
  background: var(--wt-contentWrapper-color, #fff);
  border-radius: 16px;
  padding: 20px;

  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;
  justify-content: center;

  /* Позиції відносно відеоплеєра */
  &.right {
    right: 16px;
  }
  &.left {
    left: 16px;
  }
}

/* Внутрішній блок з превʼюшкою */
.preview-wrapper {
  position: relative;

  /* приблизно 64x42 як у Figma */
  width: 64px;
  height: 42px;
}

/* Картинка превʼю */
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  border-radius: 8px;
  display: block;
}

/* Кнопка закриття (великий круг зверху справа) */
.close-btn {
  position: absolute;
  top: -12px;
  right: -12px;

  width: 32px;
  height: 32px;

  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.85);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  padding: 0;

  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 1);
  }
}
</style>
