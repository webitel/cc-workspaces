<template>
  <a
    class="load-more-button"
    @click.prevent="loadMore"
  >
    {{ $t('reusable.more') }}
  </a>
</template>

<script setup>
import { useStore } from 'vuex';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();

const loadMore = async () => await store.dispatch(`${props.namespace}/LOAD_NEXT`);

</script>

<style lang="scss" scoped>

.load-more-button {
    margin: 0 auto;
    color: var(--text-link-color);
    cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

</style>
