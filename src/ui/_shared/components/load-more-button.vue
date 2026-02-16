<template>
  <a
    class="load-more-button"
    @click.prevent="loadMore"
  >
    {{ $t('reusable.more') }}
  </a>
</template>

<script setup>
const props = defineProps({
	loadMore: {
		type: Function,
		required: true,
	},
});
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
