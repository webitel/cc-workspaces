<template>
  <article class="md markdown-body" v-html="computeHTML"></article>
</template>

<script>
  import MarkdownIt from 'markdown-it';
  import { mapGetters } from 'vuex';
  import deepCopy from 'deep-copy';
  import patchMDRender from './scripts/patchMDRender';

  const md = new MarkdownIt({ linkify: true });
  patchMDRender(md);

  export default {
    name: 'client-info-markdown',
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
@import '../../../../../../node_modules/github-markdown-css/github-markdown.css';

  .md {
    @extend .typo-body-md;
  }
</style>
