<template>
  <div class="processing-form-file-wrapper">
    <div class="processing-form-file-wrapper__attach">
      <wt-icon
        icon="attach"
        size="sm"
        color="contrast"
      ></wt-icon>
    </div>
    <form-file
      v-for="el of parseInitialValue"
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
    parseInitialValue() {
      return JSON.parse(this.initialValue);
    },
  },
  mounted() {
    this.$attrs.value = JSON.parse(this.$attrs.value);
  },
};
</script>

<style lang="scss" scoped>
$default-color: #1A90E5;

.processing-form-file-wrapper {
  position: relative;
  border: 1px dashed $default-color;
  border-radius: var(--border-radius);
  padding: var(--spacing-sm);

  .processing-form-file-wrapper__attach {
    position: absolute;
    top: 0;
    right: var(--spacing-xs);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    padding: var(--spacing-3xs);
    background: $default-color;
    line-height: 0;
  }
}
</style>
