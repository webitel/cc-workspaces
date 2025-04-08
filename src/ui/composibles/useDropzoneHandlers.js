import { ref } from 'vue';

export const useDropzoneHandlers = () => {

  const isDropzoneVisible = ref(false);

  function handleDragEnter() {
    isDropzoneVisible.value = true;
  }

  function handleDragLeave() {
    isDropzoneVisible.value = false;
  }

  return {
    isDropzoneVisible,
    handleDragEnter,
    handleDragLeave,
  };
};
