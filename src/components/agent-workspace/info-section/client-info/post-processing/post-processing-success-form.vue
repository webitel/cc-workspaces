<template>
  <form class="processing-form processing-form__success">
    <wt-textarea
      v-model="taskPostProcessing.description"
      :label="$t('reusable.description')"
      :placeholder="$t('reusable.description')"
    ></wt-textarea>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';

  export default {
    name: 'post-processing-success-form',
    computed: {
      ...mapGetters('reporting', {
        taskPostProcessing: 'TASK_POST_PROCESSING',
      }),
    },
  };
</script>

<style lang="scss" scoped>
</style>
