<template>
    <wt-select
        :value="value"
        :placeholder="t('cases.status')"
        :options="options"
        :clearable="false"
        use-value-from-options-by-prop="id"
        @input="emit('input', $event)"
    >
        <template #singleLabel="{ option }">
            <wt-indicator
                :color="getIndicatorColor(option)"
                :text="option.name"
            />
        </template>

        <template #option="{ option }">
            <wt-indicator
                :color="getIndicatorColor(option)"
                :text="option.name"
            />
        </template>
    </wt-select>
</template>

<script
    setup
    lang="ts"
>
import { WebitelCasesStatusCondition } from '@webitel/api-services/gen/models';
import { WtIndicator, WtSelect } from '@webitel/ui-sdk/components';
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