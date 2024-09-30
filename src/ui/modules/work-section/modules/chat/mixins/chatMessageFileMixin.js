export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  computed: {
    image() {
      const isImage = this.file && this.file.type.includes('image');
      return isImage ? this.file : null;
    },
    media() {
      const isMedia = this.file && (
        this.file.type.includes('audio') || this.file.type.includes('video')
      );
      return isMedia ? this.file : null;
    },
    document() {
      return this.file && !this.media && !this.image ? this.file : null;
    },
  },
};
