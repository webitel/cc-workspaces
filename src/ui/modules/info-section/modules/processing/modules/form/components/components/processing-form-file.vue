<template>
  <div
    class="processing-form-file"
    @click="downloadDocument"
  >
    <div class="processing-form-file__doc">
        <div class="processing-form-file__triangle-white"></div>
        <div class="processing-form-file__triangle-blue"></div>

      <wt-icon
        icon="ws-doc"
        size="xl"
        color="contrast"
      ></wt-icon>
    </div>

    <div class="processing-form-file__info">
      <a class="processing-form-file__name" :title="name">{{ name }}</a>
      <div class="processing-form-file__size">{{ fileSize(size) }}</div>
    </div>
  </div>
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
   },
  methods: {
    async handleFileDownload() {
      const response = await this.client.getCliInstance();
      this.url = response.fileUrlDownload(this.id);
    },
    downloadDocument() {
      const a = document.createElement('a');
      a.href = this.url;
      a.target = '_blank';
      a.download = this.name;
      a.click();
    },
    fileSize(value) {
      if (!value) return '';
      return prettifyFileSize(value);
    },
  },
  mounted() {
   this.handleFileDownload();
  },
};
</script>

<style lang="scss" scoped>
$default-color: #1A90E5;

.processing-form-file{
  margin-top: var(--spacing-sm);
  cursor: pointer;

  .processing-form-file__doc{
    position: relative;
    display: flex;
    align-items: center;
    border-radius: var(--border-radius) var(--border-radius) 0px 0px;
    background-color: $default-color;
    padding: var(--spacing-xs);

    .processing-form-file__triangle-blue {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border: 0 solid transparent;
      border-right-width: var(--spacing-md);
      border-left-width: 0px;
      border-bottom: var(--spacing-md) solid var(--task-accent-deep-color);
    }

    .processing-form-file__triangle-white {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border: 0 solid transparent;
      border-left-width: var(--spacing-md);
      border-right-width: 0px;
      border-top: var(--spacing-md) solid var(--main-color);
    }
  }

  .processing-form-file__info{
    box-shadow: var(--elevation-10);
    padding: var(--spacing-sm);

    .processing-form-file__name {
      @extend %typo-body-2;
      font-weight: bold;
    }

    .processing-form-file__size {
      @extend %typo-body-2;
    }
  }
}
</style>
