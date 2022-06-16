<template>
  <task-header>
    <template v-slot:title>Lorem Ipsum</template>
    <template v-slot:subtitle>Dolor sit amet</template>
  </task-header>
</template>

<script>
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';

export default {
  name: 'job-header',
  components: { TaskHeader },
};
</script>

<style lang="scss" scoped>

</style>
