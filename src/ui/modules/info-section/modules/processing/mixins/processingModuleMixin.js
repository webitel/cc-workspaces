import ProcessingWrapper from '../components/processing-wrapper.vue';

export default {
	components: {
		ProcessingWrapper,
	},
	props: {
		task: {
			type: Object,
			required: true,
		},
	},
};
