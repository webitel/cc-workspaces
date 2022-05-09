<template>
  <section class="client-info">
    <client-info-chips/>
    <client-info-markdown/>
  </section>
</template>

<script>
import ClientInfoMarkdown from './client-info-markdown/client-info-markdown.vue';
import ClientInfoChips from './queue-name/client-info-chips.vue';

export default {
  name: 'client-info-tab',
  components: {
    ClientInfoMarkdown,
    ClientInfoChips,
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
