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
  import { mapState } from 'vuex';
  import WorkspaceStates
    from '../../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

  export default {
    name: 'knowledge-base-tab',

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

      knowledgeSource() {
        let variables = {};
        if (this.state === WorkspaceStates.CALL) variables = this.call.variables;
        else if (this.state === WorkspaceStates.MEMBER) variables = this.member.variables;
        return variables.knowledge_base;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .knowledge-base {
    @extend %wt-scrollbar;
    height: 100%;
    width: 100%;
    overflow: auto;
  }
</style>
