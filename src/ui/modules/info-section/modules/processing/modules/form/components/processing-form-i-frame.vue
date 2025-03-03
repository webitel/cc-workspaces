<template>
  <div>
    <wt-label
      v-if="label"
      :hint="hint"
    >{{ label }}
    </wt-label>
    <iframe
      :src="initialValue"
      :style="{ height }"
      allowfullscreen
      class="processing-form-i-frame__iframe"
    ></iframe>
  </div>
</template>

<script>
import ProcessingFormComponentMixin from '../mixins/processingFormComponentMixin.js';

export default {
  name: 'processing-form-i-frame',
  props: {
    height: {
      type: String,
      default: '100px',
    },
  },
  mixins: [ProcessingFormComponentMixin],
};
</script>

<style lang="scss" scoped>
.processing-form-i-frame__iframe {
  width: 100%;
}
</style>
