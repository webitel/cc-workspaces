<template>
  <section class="info-section-content processing">
    <the-processing-form
      v-if="task.task.hasForm"
      :task="task"
    ></the-processing-form>
    <the-reporting
      v-else
      :task="task"
    ></the-reporting>
  </section>
</template>

<script>
import TheProcessingForm from '../modules/form/components/the-processing-form.vue';
import TheReporting from '../modules/reporting/components/the-reporting.vue';

export default {
  name: 'processing-tab',
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
