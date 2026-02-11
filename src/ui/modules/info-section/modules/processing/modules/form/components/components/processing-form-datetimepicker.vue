<template>
  <wt-datepicker
    v-bind="$attrs"
    :value="date"
    :timezone="timezone"
    mode="datetime"
    @input="$emit('input', $event)"
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
