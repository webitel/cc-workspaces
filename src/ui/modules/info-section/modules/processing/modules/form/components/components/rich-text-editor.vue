<template>
  <article class="rich-text-editor">
    <wt-label
      v-if="label"
      :hint="hint"
    >{{ label }}</wt-label>
    <editor
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
}


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
  mixins: [processingFormComponentMixin],
  props: {
    value: {
      type: String,
    },
    output: {
      type: String,
      default: 'html',
      options: ['html', 'text'],
    },
    height: {
      type: [Number, String],
      default: '300',
    },
  },
  emits: [
    'input',
  ],
  computed: {
    strValue() {
      // editor breaks on Number data type :( [WTEL-4477]
      return `${this.value}`;
    },
    language() {
      return this.$i18n.locale;
    },
    config() {
      return {
        toolbar_sticky: true,
        skin: false,
        content_css: false,
        height: +this.height,
        menubar: false,
        statusbar: this.isHtml,
        toolbar_mode: 'sliding',
        language: this.language,
        // content_style: `${contentUiCss}\n${contentCss}`,
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
        ] : [];
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
};
</script>

<style lang="scss" scoped>

</style>
