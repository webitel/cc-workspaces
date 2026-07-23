<template>
    <div class="processing-report">
        <span class="processing-report__title">
            {{ t('callSuccessfulText') }}
        </span>
        <div class="processing-report__controls">
            <wt-button
                color="success"
                @click="emit('success')"
            >
                {{ t('Yes') }}
            </wt-button>
            <wt-button
                color="error"
                @click="emit('fail')"
            >
                {{ t('No') }}
            </wt-button>
        </div>
    </div>
</template>

<script
	setup
	lang="ts"
>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits<{
	success: [];
	fail: [];
}>();
</script>

<style scoped>
.processing-report {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.processing-report__title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    color: #030302;
}

.processing-report__controls {
    display: flex;
    gap: 15px;
    -webkit-app-region: no-drag;
}
</style>
