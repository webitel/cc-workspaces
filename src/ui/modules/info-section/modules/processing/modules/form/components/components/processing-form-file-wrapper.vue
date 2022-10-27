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
      v-for="(el, key) of parseInitialValue"
      :key="el.id+key.toString()"
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
      return typeof this.initialValue === 'string' ? JSON.parse(this.initialValue) : this.initialValue;
    },
  },
  mounted() {
    this.$attrs.value = typeof this.$attrs.value === 'string' ? JSON.parse(this.$attrs.value) : this.$attrs.value;
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
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    line-height: 0;
    background: $default-color;
  }
}
</style>
