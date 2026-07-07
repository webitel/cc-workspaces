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
import { WtIndicator, WtSingleSelect } from '@webitel/ui-sdk/components';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	value: WebitelCasesStatusCondition['id'];
	options: WebitelCasesStatusCondition[];
}>();

const emit = defineEmits<{
	input: [
		WebitelCasesStatusCondition['id'],
	];
}>();

const { t } = useI18n();

const formattedValue = computed(() => props.value?.id || props.value);

const selectedOption = computed(() =>
	props.options.find((option) => option.id === formattedValue.value),
);

const getIndicatorColor = (option) => {
	if (option?.final) return 'final-status';
	if (option?.initial) return 'initial-status';
	return 'other-status';
};
</script>