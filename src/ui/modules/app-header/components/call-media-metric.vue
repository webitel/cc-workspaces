<template>
  <wt-icon
    v-tooltip.bottom="showTooltip ? connectionQualityTooltip : undefined"
    :icon="`ws-signal-${quality}`"
    :size="size"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	quality: string;
	size?: string;
	showTooltip?: boolean;
}>();

const { t } = useI18n();

const connectionQualityTooltip = computed(() =>
	t(`header.connectionQuality.${props.quality}`),
);
</script>


<style scoped lang="scss">

</style>
