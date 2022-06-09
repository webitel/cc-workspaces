<template>
  <processing-wrapper
    :task="task"
    ref="processing-form"
  >
    <template v-slot:title v-if="formTitle">
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
import FormSelect from './components/processing-form-select.vue';
import FormText from './components/processing-form-text.vue';
import processingModuleMixin from '../../../mixins/processingModuleMixin';

export default {
  name: 'the-processing-form',
  mixins: [processingModuleMixin],
  components: {
    FormText,
    FormSelect,
  },
  data: () => ({
    namespace: 'ui/infoSec/processing/form',
    processingComponent: {
      'wt-select': 'form-select',
    },
  }),
  computed: {
    formTitle() {
      return this.task.task?.form?.title || '';
    },
    formBody() {
      return this.task.task?.form?.body || [];
    },
    formActions() {
      return this.task.task?.form?.actions || [];
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
      if (input) input.focus();
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