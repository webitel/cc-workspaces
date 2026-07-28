<template>
  <div class="queue-name">
    <p
      class="queue-name__text typo-body-2"
      :class="{ 'queue-name__text--expanded': expanded }"
    >
      <span class="typo-body-2-bold">{{ $t('infoSec.generalInfo.queue') }}: </span>{{ name }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
	name: string;
	expanded?: boolean;
}>();
</script>

<style lang="scss" scoped>
.queue-name {
  min-width: 0;

  &__text {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    &--expanded {
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }
}
</style>