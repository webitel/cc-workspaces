<template>
  <task-header>
    <template v-slot:title>{{ task.displayName }}</template>
    <template v-slot:subtitle>{{ task.displayNumber }}</template>
  </task-header>
</template>

<script>
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';

export default {
  name: 'job-header',
  components: { TaskHeader },
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
