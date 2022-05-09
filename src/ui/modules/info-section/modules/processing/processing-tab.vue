<template>
  <section class="info-section-content processing">
    <component
      v-for="(el, key) of form.body"
      :is="processingComponent[el.view.component] || el.view.component"
      :key="el.id+key.toString()"
      v-bind="el.view"
      :label-props="{
        hint: el.view.hint
      }"
      v-model="el.value"
    ></component>
    <div class="processing-actions">
      <wt-button
        v-for="(action) of form.actions"
        :key="action.id"
        :color="action.view.color"
        @click="sendAction(action)"
      >{{ action.view.text || action.view.id }}
      </wt-button>
    </div>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
  import FormText from './components/processing-form-text.vue';
  import FormSelect from './components/processing-form-select.vue';

  export default {
    name: 'processing-tab',
    components: {
      FormText,
      FormSelect,
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
      namespace: 'ui/agentInfo',
      processingComponent: {
        'wt-select': 'form-select',
      },
    }),
    computed: {
      form() {
        return this.task.task.form;
      },
    },
    methods: {
      sendAction(action) {
        const form = this.form.body.reduce((form, { id, value }) => ({...form, [id]: value }), {});
        this.task.task.formAction(action.id, form);
        console.info('send action', action);
      },
    },
  };
</script>

<style lang="scss" scoped>
.processing {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  .processing-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
}
</style>
