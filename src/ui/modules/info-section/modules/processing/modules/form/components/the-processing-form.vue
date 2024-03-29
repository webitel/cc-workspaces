<template>
  <processing-wrapper
    ref="processing-form"
    :task="task"
  >
    <template v-if="formTitle" v-slot:title>
      {{ formTitle }}
    </template>
    <template v-slot:form>
<!--      pass size prop only to form file component -->
      <component
        :is="processingComponent[el.view.component] || el.view.component"
        v-for="(el, key) of formBody"
        :key="el.id+key.toString()"
        v-model="el.value"
        :label-props="{ hint: el.view.hint }"
        :attempt-id="task.attempt.id"
        :size="el.view.component === 'form-file' ? size : null"
        v-bind="el.view"
      ></component>
    </template>
    <template v-slot:actions>
      <wt-button
        v-for="(action) of formActions"
        :key="action.id"
        :color="action.view.color"
        @click="sendForm({ action, task })"
      >{{ action.view.text || action.view.id }}
      </wt-button>
    </template>
  </processing-wrapper>
</template>

<script>
import { mapActions } from 'vuex';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import processingModuleMixin from '../../../mixins/processingModuleMixin';
import FormSelect from './components/processing-form-select.vue';
import FormText from './components/processing-form-text.vue';
import FormFile from './components/processing-form-file/processing-form-file.vue';
import RichTextEditorSkeleton from './components/skeletons/rich-text-editor-skeleton.vue';
import FormDatetimepicker from './components/processing-form-datetimepicker.vue';

export default {
  name: 'the-processing-form',
  mixins: [
    processingModuleMixin,
    sizeMixin,
  ],
  components: {
    FormText,
    FormSelect,
    FormFile,
    FormDatetimepicker,
    RichTextEditor: () => ({
      component: import(
        './components/rich-text-editor.vue'
        ),
      loading: RichTextEditorSkeleton,
    }),
  },
  data: () => ({
    namespace: 'ui/infoSec/processing/form',
    processingComponent: {
      'wt-select': 'form-select',
      'wt-datetimepicker': 'form-datetimepicker',
    },
  }),
  computed: {
    formTitle() {
      return this.task.attempt.form?.title || '';
    },
    formBody() {
      return this.task.attempt.form?.body || [];
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
          try {
            component.value = JSON.parse(component.view.initialValue);
          } catch {
            component.value = component.view.initialValue;
          }
        }
      });
    },
    setupAutofocus() {
      const input = this.$refs['processing-form'].$el.querySelector('input, textarea');
      if (input && !input.className.includes('select')) input.focus();
    },
  },
  watch: {
    formBody: {
      handler() {
        this.initializeValues();
      },
      immediate: true,
    },
  },
  mounted() {
    this.setupAutofocus();
  },
};
</script>

<style lang="scss" scoped>

</style>
