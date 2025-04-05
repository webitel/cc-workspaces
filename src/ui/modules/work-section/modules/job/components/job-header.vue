<template>
  <task-header :size="size">
    <template v-slot:title>{{ task.displayName }}</template>
    <template v-slot:subtitle>{{ task.displayNumber }}</template>
  </task-header>
</template>

<script>
import sizeMixin from '../../../../../../app/mixins/sizeMixin.js';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';

export default {
  name: 'job-header',
  components: { TaskHeader },
  mixins: [sizeMixin],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
