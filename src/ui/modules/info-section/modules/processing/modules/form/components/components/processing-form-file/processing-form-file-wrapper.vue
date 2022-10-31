<template>
  <div class="processing-form-file-wrapper">
    <div class="processing-form-file-wrapper__attach">
      <wt-icon
        color="contrast"
        icon="attach"
        size="sm"
      ></wt-icon>
    </div>
    <h4 class="processing-form-file-wrapper__title">
      {{ label }}
      <wt-hint
        v-if="hint"
      >{{ hint }}
      </wt-hint>
    </h4>
    <form-file
      v-for="el of parseFiles"
      :key="el.id"
      v-bind="el"
    ></form-file>
  </div>
</template>

<script>
import FormFile from './processing-form-file.vue';

export default {
  name: 'processing-form-file-wrapper',
  components: {
    FormFile,
  },
  props: {
    initialValue: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    parseFiles() {
      return JSON.parse(this.initialValue);
    },
  },
};
</script>

<style lang="scss" scoped>
$default-color: #1A90E5;

.processing-form-file-wrapper {
  position: relative;
  padding: var(--spacing-sm);
  border: 1px dashed $default-color;
  border-radius: var(--border-radius);

  .processing-form-file-wrapper__attach {
    position: absolute;
    top: 0;
    right: var(--spacing-xs);
    padding: var(--spacing-3xs);
    line-height: 0;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    background: $default-color;
  }

  .processing-form-file-wrapper__title {
    display: flex;
    align-items: center;
  }
}
</style>
