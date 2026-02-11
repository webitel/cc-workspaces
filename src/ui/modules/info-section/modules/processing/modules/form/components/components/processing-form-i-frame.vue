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
import ProcessingFormComponentMixin from '../../mixins/processingFormComponentMixin';

export default {
	name: 'ProcessingFormIFrame',
	mixins: [
		ProcessingFormComponentMixin,
	],
	props: {
		height: {
			type: String,
			default: '100px',
		},
	},
};
</script>

<style lang="scss" scoped>
.processing-form-i-frame__iframe {
  width: 100%;
}
</style>
