<template>
  <task-header :size="size">
    <template #title>{{ task.displayName }}</template>
    <template #subtitle>{{ task.displayNumber }}</template>
  </task-header>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';

export default {
  name: 'JobHeader',
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
