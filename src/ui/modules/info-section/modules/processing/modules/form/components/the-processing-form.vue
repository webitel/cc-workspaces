<template>
  <processing-wrapper
    ref="processing-form"
    :task="task"
  >
    <template v-if="formTitle" #title>
      {{ formTitle }}
    </template>
    <template #form>
      <!--      pass size prop only to form file component -->
      <component
        :is="processingComponent[el.view.component] || el.view.component"
        v-for="(el, key) of formBody"
        :key="el.id+key.toString()"
        v-model="el.value"
        :label-props="{ hint: el.view.hint }"
        :attempt-id="task.attempt.id"
        :component-id="el.id"
        :size="el.view.component === 'form-file' ? size : null"
        v-bind="el.view"
        @input="change"
        @call-table-action="sendTableAction"
      />
    </template>
    <template #actions>
      <wt-button
        v-for="(action) of formActions"
        :key="action.id"
        ref="form-action-buttons"
        :color="action.view.color"
        @click="sendForm({ action, task })"
      >{{ action.view.text || action.view.id }}
      </wt-button>
    </template>
  </processing-wrapper>

</template>

<script>
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { nextTick } from 'vue';
import { mapActions, mapGetters } from 'vuex';

import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import HotkeyAction from '../../../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../../../hotkeys/useHotkeys';
import processingModuleMixin from '../../../mixins/processingModuleMixin';
import { formattingFormBeforeSend } from '../../../script/formattingFormBeforeSend.js';
import FormDatetimepicker from './components/processing-form-datetimepicker.vue';
import FormFile from './components/processing-form-file/processing-form-file.vue';
import FormIFrame from './components/processing-form-i-frame.vue';
import FormSelect from './components/processing-form-select.vue';
import FormSelectFromObject
  from './components/processing-form-select-from-object/processing-form-select-from-object.vue';
import FormSelectService from './components/processing-form-select-service.vue';
import FormTable from './components/processing-form-table/processing-form-table.vue';
import FormText from './components/processing-form-text.vue';
import RichTextEditorSkeleton from './components/skeletons/rich-text-editor-skeleton.vue';

export default {
  name: 'TheProcessingForm',
  components: {
    FormIFrame,
    FormText,
    FormSelect,
    FormSelectService,
    FormFile,
    FormDatetimepicker,
    FormSelectFromObject,
    FormTable,
    RichTextEditor: () => ({
      component: import(
        './components/rich-text-editor.vue'
        ),
      loading: RichTextEditorSkeleton,
    }),
  },
  mixins: [
    processingModuleMixin,
    sizeMixin,
  ],
  data: () => ({
    namespace: 'ui/infoSec/processing/form',
    processingComponent: {
      'wt-select': 'form-select',
      'wt-datetimepicker': 'form-datetimepicker',
      'form-i-frame': 'form-i-frame',
    },
    hotkeyUnsubscribers: [],
  }),
  computed: {
    ...mapGetters('workspace', {
      isCall: 'IS_CALL_WORKSPACE',
    }),
    formTitle() {
      return this.task.attempt.form?.title || '';
    },
    formBody() {
      return this.task.attempt.form?.body || [];
    },
    formMetadata() {
      return this.task.attempt.form?.metadata || {};
    },
    formActions() {
      return this.task.attempt.form?.actions || [];
    },
  },
  methods: {
    ...mapActions({
      sendForm(dispatch, payload) {
        return dispatch(`${this.namespace}/SEND_FORM`, payload);
      },
      sendReporting(dispatch, payload) {
        return dispatch(`${this.namespace}/SEND_REPORTING`, payload);
      },
    }),
    initializeValues() {
      this.formBody.forEach((component) => {
        if (isEmpty(component.value) && component.view.initialValue) {

          // For component wt-select we need get by initialValue value from options
          // https://webitel.atlassian.net/browse/WTEL-6742
          if (component.view.component === 'wt-select') {
            return component.value = component.view.options.find((option) => option.value === component.view.initialValue) || component.view.initialValue;
          }

          try {
            const parseValue = JSON.parse(component.view.initialValue);

            // For component form-text if pass object without keys we need set null
            // https://webitel.atlassian.net/browse/WTEL-6568
            if (typeof parseValue === 'object') {
              component.value = Object.keys(parseValue).length ? parseValue : null;
            } else {
              component.value = parseValue;
            }
          } catch {
            component.value = component.view.initialValue;
          }
        }
      });
      this.task.attempt.form.metadata.isInited = true;
    },
    setupAutofocus() {
      const input = this.$refs['processing-form'].$el.querySelector('input, textarea');
      if (input && !input.className.includes('select')) input.focus();
    },
    setupHotkeys() {
      const subscripers = [
        {
          event: HotkeyAction.SUBMIT_FORM,
          callback: (event) => {
            // get digit form event.code. e.g "1" form "Digit1" string
            const digit = event.code[event.code.length - 1];
            const index = +digit - 1;
            const button = this.$refs['form-action-buttons'][index].$el;
            if (button) button.focus();
          },
        },
      ];
      this.hotkeyUnsubscribers = useHotkeys(subscripers);
    },
    change() {
      nextTick(() => { // we have to save any changes from formBody in task (for back-end) https://webitel.atlassian.net/browse/WTEL-6153
        if (this.isCall) this.task.attempt.form.fields = formattingFormBeforeSend(this.formBody);
      });
    },
    sendTableAction({ action, componentId, row }) {
      const vars = { [action]: row };
      this.task.attempt.componentAction(componentId, action, vars);
      // https://webitel.atlassian.net/browse/WTEL-6707
    },
  },
  watch: {
    formBody: {
      handler(value) {
        if (value.length && !this.formMetadata.isInited) {
          this.task.attempt.form.metadata = {}; // init form metadata
          this.initializeValues();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.setupAutofocus();
    this.setupHotkeys();
  },

  unmounted() {
    this.hotkeyUnsubscribers((unsubscribe) => unsubscribe());
  },
};
</script>

<style lang="scss" scoped>
footer.processing-actions .wt-button:focus {
  // https://stackoverflow.com/questions/73658895/document-getelementbyid-focus-not-working-on-button
  outline: -webkit-focus-ring-color auto 1px;
}
</style>
