<template>
    <div class="call-view-variables">
        <p
            v-for="[key, value] in entries"
            :key="key"
            class="call-view-variables__row"
        >
            <span
                class="call-view-variables__key"
                v-html="md.renderInline(key)"
            ></span>
            <span v-html="md.renderInline(`: ${format(value)}`)"></span>
        </p>
    </div>
</template>

<script
	setup
	lang="ts"
>
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';

const props = defineProps<{
	variables: Record<string, string>;
}>();

const md = new MarkdownIt();

const entries = computed(() => Object.entries(props.variables));

function isValidHttpUrl(s: string) {
	try {
		const u = new URL(s);
		return u.protocol === 'http:' || u.protocol === 'https:';
	} catch {
		return false;
	}
}

function format(value: string) {
	return isValidHttpUrl(String(value)) ? `<${value}>` : value;
}
</script>

<style scoped>
.call-view-variables {
    padding: 10px 15px;
    font-size: 14px;
    line-height: 1.3;
    word-break: break-word;
}

.call-view-variables__key {
    font-weight: 600;
}
</style>
