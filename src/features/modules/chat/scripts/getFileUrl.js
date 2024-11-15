export default function ({ id, type }) {
  const token = localStorage.getItem('access-token');

  let link = `${import.meta.env.VITE_API_URL}/storage/file/${id}/download?access_token=${token}`;

  if (type.includes('source')) {
    const source = type.match(/source=[^;]+/)[0];
    link = `${link}&${source}`;
  }

  return link;
};
