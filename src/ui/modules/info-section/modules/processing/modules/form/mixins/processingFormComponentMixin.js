export default {
	props: {
		initialValue: {
			type: [
				String,
				Array,
			],
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
		hint: {
			type: String,
			default: '',
		},
	},
};
