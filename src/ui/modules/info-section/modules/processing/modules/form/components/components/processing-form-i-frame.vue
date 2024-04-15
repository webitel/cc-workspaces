<template>
  <div>
    <wt-label
      v-if="label"
      :hint="hint"
    >{{ label }}</wt-label>
    <iframe
      class="processing-form-i-frame__iframe"
      :height="iframeHeight"
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
    isHeightFixed: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    iframeHeight() {
      return this.height + this.heightUnit;
    },
    heightUnit() {
      return this.isHeightFixed ? 'px' : '%';
    },
  },
  mixins: [ProcessingFormComponentMixin],
};
</script>

<style lang="scss" scoped>
.processing-form-i-frame__iframe{
  width: 100%;
}
</style>
