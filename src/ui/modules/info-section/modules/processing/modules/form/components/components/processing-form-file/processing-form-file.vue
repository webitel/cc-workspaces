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
    async urlInitialization() {
      const response = await this.client.getCliInstance();
      this.url = response.fileUrlDownload(this.id);
    },
  },
  mounted() {
   this.urlInitialization();
  },
};
</script>

<style lang="scss" scoped>

.processing-form-file {
  display: block;
  margin-top: var(--spacing-sm);

  .processing-form-file__header {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: var(--border-radius) var(--border-radius) 0px 0px;
    padding: var(--spacing-xs);
    background-color: var(--job-color);

    .processing-form-file__triangle--inner {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border: 0 solid transparent;
      border-bottom: var(--spacing-md) solid var(--job--hover-color);
      border-right-width: var(--spacing-md);
      border-left-width: 0px;
    }

    .processing-form-file__triangle--outer {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border: 0 solid transparent;
      border-top: var(--spacing-md) solid var(--main-color);
      border-left-width: var(--spacing-md);
      border-right-width: 0px;
    }
  }

  .processing-form-file__info {
    box-shadow: var(--elevation-10);
    padding: var(--spacing-sm);

    .processing-form-file__name {
      @extend %typo-subtitle-2;
    }

    .processing-form-file__size {
      @extend %typo-body-2;
    }
  }
}
</style>
