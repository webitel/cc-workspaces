<template>
  <div
    :class="{ 'processing-form-file-line--readonly': readonly }"
    class="processing-form-file-line"
  >
    <wt-icon
      :icon="typeIcon"
    ></wt-icon>
    <a
      :href="href"
      class="processing-form-file-line__name"
      target="_blank"
    >{{ file.name }}</a>
    <p class="processing-form-file-line__size">{{ readableSize }}</p>
    <div
      v-if="!readonly"
      class="processing-form-file-line__load-wrapper"
    >
      <wt-load-bar
        v-if="status === FileStatus.PROGRESS"
        :max="file.metadata.progress.total"
        :value="file.metadata.progress.loaded"
      ></wt-load-bar>
    </div>
    <div v-if="!readonly">
      <component
        :is="actionIcon.component"
        :icon="actionIcon.icon"
        :color="actionIcon.color"
        @click="actionIcon.handler && actionIcon.handler()"
      ></component>
    </div>
  </div>
</template>

<script>
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import { mapState } from 'vuex';

const FileStatus = Object.freeze({
  ERROR: 'error',
  PROGRESS: 'progress',
  DONE: 'done',
  AFTER_DONE: 'afterDone',
  AFTER_ERROR: 'afterError',
                                 });

export default {
  name: 'processing-form-file-line',
  props: {
    file: {
      type: [File, Object],
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    href: '',
    FileStatus,
  }),
  computed: {
    ...mapState({
                  client: (state) => state.client,
                }),
    readableSize() {
      return prettifyFileSize(this.file.size);
    },
    typeIcon() {
      const type = this.file.mime;
      if (type.includes('image')) return 'preview-tag-image';
      if (type.includes('application')) return 'preview-tag-application';
      if (type.includes('video')) return 'preview-tag-video';
      if (type.includes('audio')) return 'preview-tag-audio';
      return 'docs';
    },
    actionIcon() {
      switch (this.status) {
        case FileStatus.DONE: return { component: 'wt-icon-btn', icon: 'bucket', handler: () => this.$emit('delete') };
        case FileStatus.ERROR: return { component: 'wt-icon-btn', icon: 'close', handler: () => this.file.metadata.close() };
        case FileStatus.AFTER_DONE: return { component: 'wt-icon', icon: 'done' };
        case FileStatus.AFTER_ERROR: return { component: 'wt-icon', icon: 'attention', color: 'danger' };
        default: return {};
      }
    },
    status() {
      if (this.file.id) return FileStatus.DONE;
      if (this.file.metadata?.done) return FileStatus.AFTER_DONE;
      if (this.file.metadata?.close) return FileStatus.ERROR;
      if (this.file.metadata?.error) return FileStatus.AFTER_ERROR;
      if (this.file.metadata?.progress) return FileStatus.PROGRESS;
      return '';
    },
  },
  methods: {
    async initHref() {
      const cli = await this.client.getCliInstance();
      this.href = cli.fileUrlDownload(this.file.id);
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
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--secondary-color);
  grid-template-columns: 24px 1fr 100px 100px 24px;
  gap: var(--spacing-xs);

  &--readonly {
    grid-template-columns: 24px 1fr 100px;
  }

  .processing-form-file-line__name {
    word-break: break-all;
  }

  .processing-form-file-line__load-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
