<template>
  <wt-button
    color="secondary"
    variant="text"
    size="sm"
    class="load-more-button"
    @click.prevent="loadMore"
  >
    <span class="typo-button--sm">{{ $t('reusable.more') }}</span>
  </wt-button>
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
  --load-more-min-width: 70px;

  min-width: var(--load-more-min-width);
  margin: 0 auto;
}
</style>
 