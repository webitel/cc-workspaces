export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
    my: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    image() {
      const isImage = this.message.file && this.message.file.mime.includes('image');
      return isImage ? this.message.file : null;
    },
    audio() {
      const isAudio = this.message.file && (
        this.message.file.mime.includes('audio') || this.message.file.mime.includes('video')
      );
      return isAudio ? this.message.file : null;
    },
    document() {
      return this.message.file;
    },
    showDocument() {
      return this.document && !this.audio && !this.image;
    },
  },
};
