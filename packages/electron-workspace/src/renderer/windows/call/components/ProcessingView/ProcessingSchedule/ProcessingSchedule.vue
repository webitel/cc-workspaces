<template>
    <div class="processing-schedule">
        <span class="processing-schedule__title">
            {{ t('scheduleCallText') }}
        </span>

        <div class="processing-schedule__choice">
            <wt-radio
                v-model:selected="selected"
                :value="true"
                :label="t('Yes')"
            />
            <wt-radio
                v-model:selected="selected"
                :value="false"
                :label="t('No')"
            />
        </div>

        <SchedulePicker
            v-if="isScheduleCall"
            v-model="scheduleAt"
        />

        <wt-button
            color="warn"
            @click="emit('save')"
        >
            {{ t('Save') }}
        </wt-button>
    </div>
</template>

<script
	setup
	lang="ts"
>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SchedulePicker from './SchedulePicker.vue';

const props = defineProps<{
	isScheduleCall: boolean;
	nextDistributeAt: number | undefined;
}>();

const emit = defineEmits<{
	choice: [
		value: boolean,
	];
	save: [];
}>();

const { t } = useI18n();

const scheduleAt = ref<number | undefined>();

const selected = computed({
	get: () => props.isScheduleCall,
	set: (value: boolean) => emit('choice', value),
});

watch(
	() => props.nextDistributeAt,
	(v) => {
		if (v) scheduleAt.value = v;
	},
	{
		immediate: true,
	},
);
</script>

<style scoped>
.processing-schedule {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    -webkit-app-region: no-drag;
}

.processing-schedule__title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    color: #030302;
    -webkit-app-region: drag;
}

.processing-schedule__choice {
    display: flex;
    gap: 33px;
}
</style>
