import Dropzone from '../components/utils/dropzone.vue';

export default {
	components: {
		Dropzone,
	},
	data: () => ({
		isDropzoneVisible: false,
	}),
	methods: {
		handleDragEnter() {
			this.isDropzoneVisible = true;
		},
		handleDragLeave() {
			this.isDropzoneVisible = false;
		},
	},
};
