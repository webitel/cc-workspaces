<template>
  <section class="client-info">
    <article id="md" class="md" v-html="computeHTML"></article>
  </section>
</template>

<script>
  import MarkdownIt from 'markdown-it';
  import { mapState } from 'vuex';

  const md = new MarkdownIt();

  export default {
    name: 'client-info-tab',
    data: () => ({
      md,
    }),

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
      }),

      computeHTML() {
        let res = '';
        if (this.call.payload) {
          Object.keys(this.call.payload).forEach((key) => {
            res += `<h3>${key}:</h3>`;
            res += md.render(this.call.payload[key]);
            res += '<br/>';
          });
        }
        return res;
      },
    },
  };
</script>

<style lang="scss">
  @import "../../../css/agent-workspace/info-section/md-styles";

  .md {
    @extend .cc-scrollbar;
    max-height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
