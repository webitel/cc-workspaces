<template>
  <section class="client-info">
    <article id="md" class="md" v-html="mdHtml"></article>
  </section>
</template>

<script>
  import MarkdownIt from 'markdown-it';

  const md = new MarkdownIt();

  export default {
    name: 'client-info-tab',
    data: () => ({
      md,
      mdHtml: '',
    }),
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
