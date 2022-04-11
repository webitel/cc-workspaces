<template>
  <article class="knowledge-base">
    <iframe
      class="knowledge-base__iframe"
      v-if="knowledgeSource"
      :src="knowledgeSource"
      width="1440"
      height="900"
      allowfullscreen
    ></iframe>
    <div v-else>An error occured: there's no knowledge base source url :(</div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

  export default {
    name: 'knowledge-base-tab',

    computed: {
      ...mapGetters('workspace', {
        taskOnWorkspace: 'TASK_ON_WORKSPACE',
      }),

      knowledgeSource() {
        const { variables } = this.taskOnWorkspace;
        return variables?.knowledge_base;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .knowledge-base {
    @extend %wt-scrollbar;
    height: 100%;
    width: 100%;
    overflow: scroll;
  }
</style>
