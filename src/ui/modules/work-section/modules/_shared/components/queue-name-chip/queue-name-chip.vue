<template>
  <wt-chip
    v-if="name"
    class="queue-name-chip"
    :color="color"
  >
    {{ name }}
  </wt-chip>
</template>

<script lang="ts" setup>
import { ChipColor } from '@webitel/ui-sdk/enums';

withDefaults(
  defineProps<{
    name: string;
    color?: ChipColor;
  }>(),
  {
    color: ChipColor.SECONDARY,
  },
);
</script>

<style lang="scss" scoped>
.queue-name-chip {
  word-break: break-word;
  white-space: break-spaces;
}
</style>
