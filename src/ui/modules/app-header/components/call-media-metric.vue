<template>
  <wt-icon
    v-tooltip.bottom="connectionQualityTooltip"
    :icon="`ws-signal-${connectionQuality}`"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const store = useStore();
const { t } = useI18n();

const connectionQuality = computed(
	() => store.getters['features/connectionQuality/LATENCY_LEVEL'],
);

const connectionQualityTooltip = computed(() =>
	t(`header.connectionQuality.${connectionQuality.value}`),
);
</script>


<style scoped lang="scss">

</style>
