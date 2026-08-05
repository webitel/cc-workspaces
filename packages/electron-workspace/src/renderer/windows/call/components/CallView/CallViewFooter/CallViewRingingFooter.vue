<template>
    <wt-button
        color="success"
        @click="emit('accept')"
    >
        {{ t('Answer') }}
    </wt-button>
    <wt-button
        color="error"
        @click="emit('reject')"
    >
        {{ t('Reject') }}
    </wt-button>
</template>

<script
	setup
	lang="ts"
>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits<{
	accept: [];
	reject: [];
}>();
</script>

<style scoped></style>
