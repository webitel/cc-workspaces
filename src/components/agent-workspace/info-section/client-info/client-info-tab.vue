<template>
  <section class="client-info">
    <article class="md markdown-body" v-html="computeHTML"></article>
  </section>
</template>

<script>
  import MarkdownIt from 'markdown-it';
  import { mapState } from 'vuex';
  import WorkspaceStates
    from '../../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';
  import patchMDRender from './_internals/patchMDRender';

  const md = new MarkdownIt({ linkify: true });
  patchMDRender(md);

  export default {
    name: 'client-info-tab',
    data: () => ({
      md,
    }),

    computed: {
      ...mapState('workspace', {
        state: (state) => state.workspaceState,
      }),
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
      }),
      ...mapState('member', {
        member: (state) => state.memberOnWorkspace,
      }),

      computeHTML() {
        let variables;
        if (this.state === WorkspaceStates.CALL) variables = this.call.variables;
        else if (this.state === WorkspaceStates.MEMBER) variables = this.member.variables;
        let res = '';
        if (variables) {
          delete variables.knowledge_base;
          Object.keys(variables).forEach((name) => {
            res += md.render(`**${name}:** ${variables[name]} \n ---`);
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
