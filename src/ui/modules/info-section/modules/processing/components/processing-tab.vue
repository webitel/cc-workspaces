<template>
  <section
    class="info-section-content processing"
    ref="processing"
  >
    <component
      v-for="(el, key) of formBody"
      :is="processingComponent[el.view.component] || el.view.component"
      :key="el.id+key.toString()"
      v-bind="el.view"
      :label-props="{
        hint: el.view.hint
      }"
      v-model="el.value"
    ></component>
    <processing-timer
      v-if="showTimer"
      :start-processing-at="task.task.startProcessingAt"
      :processing-timeout-at="task.task.processingTimeoutAt"
      :processing-sec="task.task.processingSec"
      :renewal-sec="task.task.renewalSec"
      @click="renewProcessingTime({ task })"
    ></processing-timer>
    <div class="processing-actions">
      <wt-button
        v-for="(action) of formActions"
        :key="action.id"
        :color="action.view.color"
        @click="sendForm({ action, task })"
      >{{ action.view.text || action.view.id }}
      </wt-button>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import FormText from './components/processing-form-text.vue';
import FormSelect from './components/processing-form-select.vue';
import ProcessingTimer from './timer/processing-timer.vue';

export default {
  name: 'processing-tab',
  components: {
    FormText,
    FormSelect,
    ProcessingTimer,
  },
  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
    },
  },
  data: () => ({
    namespace: 'ui/infoSec/processing',
    processingComponent: {
      'wt-select': 'form-select',
    },
  }),
  computed: {
    formBody() {
      return this.task.task.form.body || [];
    },
    formActions() {
      return this.task.task.form.actions || [];
    },
    showTimer() {
      return this.task.task?.processingSec;
    },
  },
  methods: {
    ...mapActions({
                    sendForm(dispatch, payload) {
                      return dispatch(`${this.namespace}/SEND_FORM`, payload);
                    },
                    renewProcessingTime(dispatch, payload) {
                      return dispatch(`${this.namespace}/RENEW_PROCESSING_TIME`, payload);
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
      const input = this.$refs.processing.querySelector('input, textarea');
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
.processing {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  .processing-timer {
    margin: auto;
  }

  .processing-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
}
</style>
