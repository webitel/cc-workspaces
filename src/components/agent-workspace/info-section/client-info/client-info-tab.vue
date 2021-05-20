<template>
  <section class="client-info">
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

  export default {
    name: 'client-info-tab',
    components: {
      ClientInfoMarkdown,
      PostProcessing,
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
