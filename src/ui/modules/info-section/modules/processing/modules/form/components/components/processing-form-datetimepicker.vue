<template>
  <wt-datepicker
    v-bind="$attrs"
    :model-value="date"
    :timezone="timezone"
    show-time
    @update:model-value="$emit('input', $event)"
  />
</template>

<script>
import { getUserTimezone } from '../../../../script/getUserTimezone';

export default {
	name: 'ProcessingFormDatetimepicker',
	model: {
		event: 'input',
	},
	props: {
		value: {
			type: [
				String,
				Number,
			],
		},
	},
	computed: {
		date() {
			return !this.value || this.value === 'now' ? Date.now() : this.value;
		},
		timezone() {
			return getUserTimezone();
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
