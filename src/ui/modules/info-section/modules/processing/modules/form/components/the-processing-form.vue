<template>
  <processing-wrapper
    ref="processing-form"
    :task="task"
  >
    <template v-if="formTitle" v-slot:title>
      {{ formTitle }}
    </template>
    <template v-slot:form>
      <component
        :is="processingComponent[el.view.component] || el.view.component"
        v-for="(el, key) of formBody"
        :key="el.id+key.toString()"
        v-model="el.value"
        :label-props="{
        hint: el.view.hint
      }"
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
import processingModuleMixin from '../../../mixins/processingModuleMixin';
import FormSelect from './components/processing-form-select.vue';
import FormText from './components/processing-form-text.vue';
import RichTextEditorSkeleton from './components/skeletons/rich-text-editor-skeleton.vue';

export default {
  name: 'the-processing-form',
  mixins: [processingModuleMixin],
  components: {
    FormText,
    FormSelect,
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
        if (!component.value && component.view.initialValue) {
          // eslint-disable-next-line no-param-reassign
          component.value = component.view.initialValue;
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
