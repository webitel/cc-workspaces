<template>
    <div class="call-view-body">
        <wt-chip
            v-if="queueName"
            color="secondary"
        >
            {{ queueName }}
        </wt-chip>

        <wt-expansion-panel
            v-if="hasVariables"
            size="sm"
            collapsed
        >
            <template #title>
                {{ t('additionalInfo') }}
            </template>
            <CallViewVariables :variables="variables" />
        </wt-expansion-panel>
    </div>
</template>

<script
	setup
	lang="ts"
>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CallViewVariables from './CallViewVariables.vue';

const props = defineProps<{
	queueName: string;
	variables: Record<string, string> | undefined;
}>();

const { t } = useI18n();

const hasVariables = computed(
	() =>
		!!props.variables &&
		typeof props.variables === 'object' &&
		Object.keys(props.variables).length > 0,
);
</script>

<style scoped>
.call-view-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.wt-chip {
    width: fit-content;
}
</style>
