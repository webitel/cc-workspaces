<template>
  <section class="client-info">
    <article class="md markdown-body" v-html="computeHTML"></article>
  </section>
</template>

<script>
  import MarkdownIt from 'markdown-it';
  import { mapGetters } from 'vuex';
  import deepCopy from 'deep-copy';
  import patchMDRender from './_internals/patchMDRender';

  const md = new MarkdownIt({ linkify: true });
  patchMDRender(md);

  export default {
    name: 'client-info-tab',
    data: () => ({
      md,
    }),

    computed: {
      ...mapGetters('workspace', {
        taskOnWorkspace: 'TASK_ON_WORKSPACE',
      }),
      computeHTML() {
        const { variables } = this.taskOnWorkspace;
        let res = '';
        if (variables) {
          const variablesCopy = deepCopy(variables);
          delete variablesCopy.knowledge_base;
          Object.keys(variablesCopy).forEach((name) => {
            res += md.render(`**${name}:** ${variablesCopy[name]}`);
          });
        }
        return res;
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '~github-markdown-css/github-markdown.css';

  .md {
    @extend .typo-body-md;
    @extend .cc-scrollbar;
    max-height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
