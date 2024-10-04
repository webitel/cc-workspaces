export default function (fileId) {
  const token = localStorage.getItem('access-token');

  return `${import.meta.env.VITE_API_URL}/storage/file/${fileId}/download?access_token=${token}`;
};
