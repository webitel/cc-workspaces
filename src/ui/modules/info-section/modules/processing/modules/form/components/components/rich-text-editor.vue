<template>
  <!-- the shared ui-sdk editor, which loads TinyMCE only when rendered -->
  <wt-rich-text-editor
    :height="height"
    :label="label"
    :label-props="{ hint }"
    :model-value="strValue"
    :output="output"
    @update:model-value="$emit('input', $event)"
  />
</template>

<script>
import processingFormComponentMixin from '../../mixins/processingFormComponentMixin';

export default {
	name: 'RichTextEditor',
	mixins: [
		processingFormComponentMixin,
	],
	props: {
		value: {
			type: [
				String,
				Number,
			],
		},
		output: {
			type: String,
			default: 'html',
			options: [
				'html',
				'text',
			],
		},
		height: {
			type: [
				Number,
				String,
			],
			default: '300',
		},
	},
	emits: [
		'input',
	],
	computed: {
		strValue() {
			// the editor takes a string only; a seed can be a number [WTEL-4477]
			return this.value === undefined || this.value === null
				? ''
				: `${this.value}`;
		},
	},
};
</script>
