/* eslint-disable no-param-reassign */
// FIXME move to webitel-ui, copied from admin

const defaultSearchRegex = /(\?|\&)(q|name)\=([^&]+)/gs;

const onFulfilled = (searchRegex = defaultSearchRegex) => (request) => {
  if (request.method === 'get') {
    const searches = request.url.match(searchRegex) || [];
    searches.forEach((search) => {
      if (search.slice(-1) !== '*') {
        request.url = request.url.replace(search, `${search}*`);
      }
    });
  }
  return request;
};

const setup = (searchRegex = defaultSearchRegex) => ({
  onFulfilled: onFulfilled(searchRegex),
});

const attachStarToRequestUrlSearchQuery = {
  setup,
  default: [
    onFulfilled(defaultSearchRegex),
  ],
};

export default attachStarToRequestUrlSearchQuery;
