<script setup>
const props = defineProps({
  isNext: {
    type: Boolean,
    default: false,
  },
  isPrev: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const emit = defineEmits(['next', 'prev']);
</script>

<template>
<header>
  <div>
    <wt-icon-btn
      v-if="isPrev"
      icon="arrow-left"
      @click="emit('prev')"
    ></wt-icon-btn>
  </div>
  <div>
    Title
  </div>
  <div>
    <wt-icon-btn
      v-if="isNext"
      icon="arrow-right"
      @click="emit('next')"
    ></wt-icon-btn>
  </div>
</header>
</template>

<style scoped lang="scss">
.header {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
}
</style>
