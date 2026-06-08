<template>
    <wt-single-select
        :model-value="value"
        :placeholder="t('cases.status')"
        :options="options"
        :show-clear="false"
        option-value="id"
        @update:model-value="emit('input', $event)"
    >
        <template #value="{ value }">
            <wt-indicator
                :color="getIndicatorColor(value)"
                :text="value.name"
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

const getIndicatorColor = (option) => {
	if (option?.final) return 'final-status';
	if (option?.initial) return 'initial-status';
	return 'other-status';
};
</script>