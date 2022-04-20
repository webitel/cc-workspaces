<template>
  <form class="processing-form processing-form__success">
    <wt-select
      v-if="descriptionOptions"
      v-model="taskPostProcessing.description"
      :options="descriptionOptions"
      :label="$t('reusable.description')"
      :track-by="null"
    ></wt-select>
    <wt-textarea
      v-else
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
      ...mapGetters('features/reporting', {
        taskPostProcessing: 'TASK_POST_PROCESSING',
      }),
      ...mapGetters('workspace', {
        taskOnWorkspace: 'TASK_ON_WORKSPACE',
      }),
      descriptionOptions() {
        const queueId = this.taskOnWorkspace.task?.queue?.id;
        return this.$config?.POST_PROCESSING?.[queueId]; // option strings
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
