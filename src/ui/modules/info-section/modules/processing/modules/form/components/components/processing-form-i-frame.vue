<template>
  <div>
    <wt-label
      v-if="label"
      :hint="hint"
    >{{ label }}
    </wt-label>
    <iframe
      class="processing-form-i-frame__iframe"
      :src="initialValue"
      allowfullscreen
      :style="{ height: iframeHeight }"
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
      default: '100',
    },
    isHeightFixed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iframeHeight() {
      const unit = this.isHeightFixed ? 'px' : 'vh';
      return this.height + unit;
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
