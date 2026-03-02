export default {
	props: {
		file: {
			type: Object,
			default: null,
		},
		type: {
			type: String,
			default: null,
		},
	},
	computed: {
		image() {
			const isImage = this.file && this.type?.includes('image');
			const isHEIC = this.type?.includes('heic');
			return isImage && !isHEIC ? this.file : null; //https://webitel.atlassian.net/browse/WTEL-6268
		},
		media() {
			const isMedia =
				this.file &&
				(this.type?.includes('audio') || this.type?.includes('video'));
			return isMedia ? this.file : null;
		},
		document() {
			return this.file && !this.media && !this.image ? this.file : null;
		},
	},
};
