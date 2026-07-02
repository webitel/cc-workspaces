<template>
  <wt-chip
    :class="['queue-name-chip', { clamped }]"
    :color="color"
  >
    <p>{{ name }}</p>
  </wt-chip>
</template>

<script lang="ts" setup>
import { ChipColor } from '@webitel/ui-sdk/enums';

withDefaults(
	defineProps<{
		name: string;
		color?: ChipColor;
		clamped?: boolean;
	}>(),
	{
		color: ChipColor.SECONDARY,
	},
);
</script>

<style lang="scss" scoped>
.queue-name-chip {
  white-space: break-spaces;
  word-break: break-word;

  &.clamped p {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
