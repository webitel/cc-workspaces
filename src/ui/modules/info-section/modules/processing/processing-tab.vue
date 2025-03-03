<template>
  <section class="info-section-content processing">
    <the-processing-form
      v-if="task.attempt?.hasForm"
      :task="task"
      :size="size"
    />
    <the-reporting
      v-else
      :task="task"
    />
  </section>
</template>

<script>
import sizeMixin from '../../../../../app/mixins/sizeMixin.js';
import TheProcessingForm from './modules/form/the-processing-form.vue';
import TheReporting from './modules/reporting/the-reporting.vue';

export default {
  name: 'processing-tab',
  mixins: [sizeMixin],
  components: {
    TheProcessingForm,
    TheReporting,
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
    },
  },
  data: () => ({
    namespace: 'ui/infoSec/processing',
  }),
};
</script>

<style lang="scss" scoped>
</style>
