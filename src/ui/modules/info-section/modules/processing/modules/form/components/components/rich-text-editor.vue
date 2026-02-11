<template>
  <article class="rich-text-editor">
    <wt-label
      v-if="label"
      :hint="hint"
    >{{ label }}</wt-label>
    <editor
      id="editor"
      :model-value="strValue"
      :initial-value="strValue"
      :init="config"
      :output-format="output"
      :plugins="plugins"
      :toolbar="toolbar"
      @update:model-value="$emit('input', $event)"
    ></editor>
  </article>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import { mapGetters } from 'vuex';

/**
 * Тут піздєц. Який? Описую в таску
 * WTEL-4477
 */
const defaultSetup = Editor.setup;

Editor.setup = (props, ctx) => {
	const _ctx = {
		...ctx,
		attrs: {
			...ctx.attrs,
			'onUpdate:modelValue': true,
		},
	};
	return defaultSetup(props, _ctx);
};

/* Import TinyMCE */
import 'tinymce/tinymce.min';
/* Default icons are required for TinyMCE 5.3 or above */
import 'tinymce/icons/default';
import 'tinymce/models/dom';
/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
/* Import content css */
// import contentCss from 'tinymce/skins/content/default/content.min.css';
// import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css';
/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css';
/* A theme is also required */
import 'tinymce/themes/silver';

import processingFormComponentMixin from '../../mixins/processingFormComponentMixin';

export default {
	name: 'RichTextEditor',
	components: {
		Editor,
	},
	mixins: [
		processingFormComponentMixin,
	],
	props: {
		value: {
			type: String,
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
		...mapGetters('ui/appearance', {
			darkMode: 'DARK_MODE',
		}),
		strValue() {
			// editor breaks on Number data type :( [WTEL-4477]
			return `${this.value}`;
		},
		language() {
			return this.$i18n.locale;
		},
		config() {
			const { bgColor, textColor } = this.getColors();

			return {
				toolbar_sticky: true,
				skin: false,
				content_css: false,
				height: +this.height,
				menubar: false,
				statusbar: this.isHtml,
				toolbar_mode: 'sliding',
				language: this.language,
				content_style: `
          body {
            background-color: ${bgColor};
            color: ${textColor};
          }
        `,
			};
		},
		isHtml() {
			return this.output === 'html';
		},
		plugins() {
			return this.isHtml
				? [
						'fullscreen',
						'image',
						'link',
						'table',
						'lists',
						'advlist',
						'emoticons',
					]
				: [];
		},
		toolbar() {
			return this.isHtml
				? `undo redo
        | bold italic underline strikethrough
        | fullscreen
        | fontfamily fontsize
        | alignleft aligncenter alignright alignjustify
        |  numlist bullist
        | forecolor backcolor removeformat
        | emoticons image link table
        `
				: 'undo redo';
		},
	},
	watch: {
		darkMode() {
			this.updateEditorColors();
		},
	},
	methods: {
		updateEditorColors() {
			const editor = tinymce?.get('editor');
			if (editor) {
				const { bgColor, textColor } = this.getColors();

				editor.dom.setStyles(editor.getBody(), {
					backgroundColor: bgColor,
					color: textColor,
				});
			}
		},
		getColors() {
			const bgColor = getComputedStyle(document.documentElement)
				.getPropertyValue('--content-wrapper-color')
				.trim();
			const textColor = getComputedStyle(document.documentElement)
				.getPropertyValue('--wt-text-field-text-color')
				.trim();

			return {
				bgColor,
				textColor,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.rich-text-editor {
  :deep(.tox-toolbar__primary) {
    background-color: var(--content-wrapper-color);
  }
  :deep(.tox-editor-header) {
    background-color: var(--content-wrapper-color);
  }
  :deep(.tox-tbtn svg) {
    fill: var(--icon-active-color);
  }
  :deep(.tox-tbtn--disabled) {
    &:hover {
      svg {
        fill: var(--icon-color);
      }
    }
    svg {
      fill: var(--icon-color);
    }
  }
}
</style>
