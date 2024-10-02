import getFileUrl from './getFileUrl.js';
export default function(file) { // added field 'type' and 'url' to message`s file object if message dosen't have
    if (!file) return null;
    return {
      ...file,
      type: file.type || file.mime,
      url: file.url || getFileUrl(file.id),
    };
}
