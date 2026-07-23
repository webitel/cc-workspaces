<template>
    <wt-single-select
        :model-value="formattedValue"
        :placeholder="t('cases.status')"
        :options="options"
        :show-clear="false"
        option-value="id"
        @update:model-value="emit('input', $event)"
    >
        <template #value>
            <wt-indicator
                :color="getIndicatorColor(selectedOption)"
                :text="selectedOption.name"
            />
        </template>

        <template #option="{ option }">
            <wt-indicator
                :color="getIndicatorColor(option)"
                :text="option.name"
            />
        </template>
    </wt-single-select>
</template>

<script
    setup
    lang="ts"
>
import { WebitelCasesStatusCondition } from '@webitel/api-services/gen/models';
import {
	WtIndicator,
	WtSingleSelect as WtSingleSelectBase,
} from '@webitel/ui-sdk/components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Barrel types components without slots; re-type via the component's declaration
// (type-only `import(...)`, erased at runtime) for <template #value/#option>.
const WtSingleSelect =
	WtSingleSelectBase as unknown as typeof import('@webitel/ui-sdk/components/wt-single-select/wt-single-select.vue.js').default;

const props = defineProps<{
	value: WebitelCasesStatusCondition['id'] | WebitelCasesStatusCondition;
	options: WebitelCasesStatusCondition[];
}>();

const emit = defineEmits<{
	input: [
		WebitelCasesStatusCondition['id'],
	];
}>();

const { t } = useI18n();

const formattedValue = computed(
	() =>
		(typeof props.value === 'object' ? props.value?.id : undefined) ||
		props.value,
);

const selectedOption = computed(() =>
	props.options.find((option) => option.id === formattedValue.value),
);

const getIndicatorColor = (option) => {
	if (option?.final) return 'final-status';
	if (option?.initial) return 'initial-status';
	return 'other-status';
};
</script>