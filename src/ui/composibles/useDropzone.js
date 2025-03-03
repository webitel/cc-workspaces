import { ref } from 'vue';

export const useDropzone = () => {

  const isDropzoneVisible = ref(false);

  function handleDragEnter() {
    this.isDropzoneVisible = true;
  }

  function handleDragLeave() {
    this.isDropzoneVisible = false;
  }

  return {
    isDropzoneVisible,
    handleDragEnter,
    handleDragLeave,
  };
};
