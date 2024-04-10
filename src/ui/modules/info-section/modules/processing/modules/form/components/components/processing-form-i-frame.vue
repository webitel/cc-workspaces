<template>
  <div>
    <wt-label
      v-if="label"
      :hint="hint"
    >{{ label }}</wt-label>
    <iframe
      class="form-component__iframe"
      :height="height"
      :src="initialValue"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
import ProcessingFormComponentMixin from '../../mixins/processingFormComponentMixin';

export default {
  name: 'processing-form-i-frame',
  props: {
    height: {
      type: String,
      default: '100%',
    },
  },
  mixins: [ProcessingFormComponentMixin],
};
</script>

<style lang="scss" scoped>
.form-component__iframe {
  width: 100%;
}
</style>
