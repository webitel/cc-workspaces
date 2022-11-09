<template>
  <a
    class="processing-form-file"
    :href="url"
    :download="name"
    target="_blank"
  >
    <div class="processing-form-file__header">
        <div class="processing-form-file__triangle--outer"></div>
        <div class="processing-form-file__triangle--inner"></div>

      <wt-icon
        icon="doc"
        size="xl"
        color="contrast"
        icon-prefix="ws"
      ></wt-icon>
    </div>

    <div class="processing-form-file__info">
      <div class="processing-form-file__name" :title="name">{{ name }}</div>
      <div class="processing-form-file__size">{{ fileSize }}</div>
    </div>
  </a>
</template>

<script>
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import { mapState } from 'vuex';

export default {
  name: 'processing-form-file',
  props: {
    id: {
      type: Number,
      default: 0,
    },
    mime: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    url: '',
  }),
  computed: {
     ...mapState({
       client: (state) => state.client,
     }),
    fileSize() {
      return prettifyFileSize(this.size);
    },
   },
  methods: {
    async initUrl() {
      const response = await this.client.getCliInstance();
      this.url = response.fileUrlDownload(this.id);
    },
  },
  created() {
   this.initUrl();
  },
};
</script>

<style lang="scss" scoped>

</style>
