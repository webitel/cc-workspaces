<template>
  <section class="client-info">
    <queue-name></queue-name>
    <client-info-markdown></client-info-markdown>
    <post-processing
      v-if="taskOnWorkspace.allowReporting"
    ></post-processing>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ClientInfoMarkdown from './client-info-markdown/client-info-markdown.vue';
  import PostProcessing from './post-processing/post-processing.vue';
  import QueueName from './queue-name/queue-name.vue';


  export default {
    name: 'client-info-tab',
    components: {
      ClientInfoMarkdown,
      PostProcessing,
      QueueName,
    },
    data: () => ({
    }),

    computed: {
      ...mapGetters('workspace', {
        taskOnWorkspace: 'TASK_ON_WORKSPACE',
      }),
    },
  };
</script>

<style lang="scss" scoped>
.client-info {
  @extend %wt-scrollbar;
  max-height: 100%;
  min-height: 0;
  overflow: auto;
}
</style>
