import LookupItem from '../lookup-item.vue';

export default {
	components: {
		LookupItem,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		handleInput() {
			this.$emit('input', this.item);
		},
	},
};
