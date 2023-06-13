<template>
  <article v-if="userDescription" class="user-description">
    <div class="user-description__head">
      <wt-icon
        icon="ws-user-description"
      ></wt-icon>
      <span class="user-description__title">{{$t('reusable.description')}}:</span>
    </div>
    <div>
      <span class="user-description__body">{{ userDescription }}</span>
    </div>
  </article>
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
    userDescription() {
      const description = this.taskOnWorkspace.task?.communication?.description;
      let res = '';
      if (description) {
        return res = description;
      }
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.user-description {
  border-radius: var(--spacing-2xs);
  background: var(--secondary-color);
  color: var(--contrast-color);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.user-description__head {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.user-description__title {
  @extend %typo-subtitle-1;
}

.user-description__body {
  @extend %typo-body-1;
}

.md {
  @extend %typo-body-2;
}
</style>
