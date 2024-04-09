<template>
  <div>
    <wt-label
      v-if="label"
      :hint="hint"
    >{{ label }}</wt-label>
    <iframe
      :height="height"
      :src="initialValue"
      allowfullscreen
      width="100%"
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

</style>
