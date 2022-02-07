<template>
  <section class="client-info">
    <client-info-badges/>
    <client-info-markdown/>
    <post-processing/>
  </section>
</template>

<script>
import ClientInfoMarkdown from './client-info-markdown/client-info-markdown.vue';
import PostProcessing from './post-processing/post-processing.vue';
import ClientInfoBadges from './queue-name/client-info-badges.vue';

export default {
  name: 'client-info-tab',
  components: {
    ClientInfoMarkdown,
    PostProcessing,
    ClientInfoBadges,
  },
};
</script>

<style lang="scss" scoped>
.client-info {
  @extend %wt-scrollbar;
  max-height: 100%;
  min-height: 0;
  overflow: auto;
}
</style>
