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
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import TheProcessingForm from '../modules/form/components/the-processing-form.vue';
import TheReporting from '../modules/reporting/components/the-reporting.vue';

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
