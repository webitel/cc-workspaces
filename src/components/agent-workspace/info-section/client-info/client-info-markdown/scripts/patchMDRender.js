/* eslint-disable no-param-reassign */
export default (md) => {
  // Remember old renderer, if overridden, or proxy to default renderer
  const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => (
    self.renderToken(tokens, idx, options)
  ));

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const attrIndex = tokens[index].attrIndex('target');
    if (attrIndex < 0) {
      tokens[index].attrPush(['target', '_blank']); // add new attribute
    } else {
      // eslint-disable-next-line no-param-reassign
      tokens[index].attrs[attrIndex][1] = '_blank'; // replace value of existing attr
    }
    return defaultRender(tokens, index, options, env, self); // pass token to default renderer.
  };
};
