<template>
  <div class="autocomplete-container">
    <quick-list
      :list="list"
      @select="select"
    />
  </div>
</template>

<script setup>
import QuickList from '../../../components/quick-list.vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select']);

const select = (item) => {
  emit('select', item);
};
</script>

<style lang="scss" scoped>
.autocomplete-trigger {
  position: absolute;
  bottom: 100%;
  width: 100%;
  background-color: var(--content-wrapper-color);
}
</style>
