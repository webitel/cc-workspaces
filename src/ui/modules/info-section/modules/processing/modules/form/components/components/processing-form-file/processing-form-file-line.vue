<template>
  <div
    :class="{ 'processing-form-file-line--readonly': readonly }"
    class="processing-form-file-line"
  >
    <wt-icon
      :icon="icon"
    ></wt-icon>
    <a
      :href="href"
      class="processing-form-file-line__name"
      target="_blank"
    >{{ name }}</a>
    <p class="processing-form-file-line__size">{{ readableSize }}</p>
    <div
      v-if="!readonly"
      class="processing-form-file-line__load-wrapper"
    ></div>
    <wt-icon-btn
      v-if="!readonly"
      icon="bucket"
    ></wt-icon-btn>
  </div>
</template>

<script>
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import { mapState } from 'vuex';

export default {
  name: 'processing-form-file-line',
  props: {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    size: {
      type: Number,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    href: '',
  }),
  computed: {
    ...mapState({
                  client: (state) => state.client,
                }),
    readableSize() {
      return prettifyFileSize(this.size);
    },
    icon() {
      if (this.type.includes('image')) return 'preview-tag-image';
      if (this.type.includes('application')) return 'preview-tag-application';
      if (this.type.includes('video')) return 'preview-tag-video';
      if (this.type.includes('audio')) return 'preview-tag-audio';
      return 'docs';
    },
  },
  methods: {
    async initHref() {
      const cli = await this.client.getCliInstance();
      this.href = cli.fileUrlDownload(this.id);
    },
  },
  created() {
    this.initHref();
  },
};
</script>

<style lang="scss" scoped>
.processing-form-file-line {
  display: grid;
  padding: var(--spacing-xs);
  border-bottom: 1px solid var(--secondary-color);
  grid-template-columns: 24px 1fr 100px 100px 24px;
  gap: var(--spacing-xs);

  &--readonly {
    grid-template-columns: 24px 1fr 100px;
  }
}
</style>
