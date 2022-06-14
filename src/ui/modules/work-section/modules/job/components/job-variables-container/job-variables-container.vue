<template>
  <section
    class="job-variables-container md markdown-body"
    v-html="variables"
  ></section>
</template>

<script>

import deepCopy from 'deep-copy';
import MarkdownIt from 'markdown-it';
import patchMDRender
  from '../../../../../info-section/modules/client-info/components/client-info-markdown/scripts/patchMDRender';

const md = new MarkdownIt({ linkify: true });
patchMDRender(md);

export default {
  name: 'job-variables-container',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    variables() {
      const { variables } = this.task;
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
.job-variables-container {
  height: 100%;
}
</style>
