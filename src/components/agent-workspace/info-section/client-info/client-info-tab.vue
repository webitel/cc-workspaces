<template>
  <section class="client-info">
    <article id="md" class="md" v-html="computeHTML"></article>
  </section>
</template>

<script>
  import MarkdownIt from 'markdown-it';
  import { mapState } from 'vuex';
  import WorkspaceStates
    from '../../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

  const md = new MarkdownIt();

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
          Object.keys(variables).forEach((key) => {
            res += `<h3>${key}:</h3>`;
            res += md.render(variables[key]);
            res += '<br/>';
          });
        }
        return res;
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../../css/agent-workspace/info-section/client-info/md-styles";

  .md {
    @extend .typo-body-md;
    @extend .cc-scrollbar;
    max-height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
