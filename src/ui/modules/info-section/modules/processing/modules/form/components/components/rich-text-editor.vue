<template>
  <!-- the shared ui-sdk editor, which loads TinyMCE only when rendered -->
  <wt-rich-text-editor
    :height="height"
    :label="label"
    :label-props="{ hint }"
    :model-value="strValue"
    :output="output"
    :plugins="editorPlugins"
    :toolbar="editorToolbar"
    @update:model-value="$emit('input', $event)"
  />
</template>

<script>
import {
	RichTextEditorToolbarItem as Item,
	RichTextEditorPlugin,
} from '@webitel/ui-sdk/enums';

import processingFormComponentMixin from '../../mixins/processingFormComponentMixin';

// [Claude] The processing form's editor setup; `text` output keeps ui-sdk's plain-text defaults
const HTML_PLUGINS = [
	RichTextEditorPlugin.ADV_LIST,
	RichTextEditorPlugin.EMOTICONS,
	RichTextEditorPlugin.FULLSCREEN,
	RichTextEditorPlugin.IMAGE,
	RichTextEditorPlugin.LINK,
	RichTextEditorPlugin.LISTS,
	RichTextEditorPlugin.TABLE,
];

const HTML_TOOLBAR = [
	[
		Item.UNDO,
		Item.REDO,
	],
	[
		Item.BOLD,
		Item.ITALIC,
		Item.UNDERLINE,
		Item.STRIKETHROUGH,
	],
	[
		Item.FULLSCREEN,
	],
	[
		Item.FONT_FAMILY,
		Item.FONT_SIZE,
	],
	[
		Item.ALIGN_LEFT,
		Item.ALIGN_CENTER,
		Item.ALIGN_RIGHT,
		Item.ALIGN_JUSTIFY,
	],
	[
		Item.NUM_LIST,
		Item.BUL_LIST,
	],
	[
		Item.FORE_COLOR,
		Item.BACK_COLOR,
		Item.REMOVE_FORMAT,
	],
	[
		Item.EMOTICONS,
		Item.IMAGE,
		Item.LINK,
		Item.TABLE,
	],
];

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
		isHtml() {
			return this.output === 'html';
		},
		editorPlugins() {
			return this.isHtml ? HTML_PLUGINS : undefined;
		},
		editorToolbar() {
			return this.isHtml ? HTML_TOOLBAR : undefined;
		},
	},
};
</script>
