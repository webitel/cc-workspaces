import dompurify from 'dompurify';

const patchLinkOpenRule = (defaultRule) => {
  return (tokens, index, options, env, self) => {
    const attrIndex = tokens[index].attrIndex('target');
    if (attrIndex < 0) {
      tokens[index].attrPush(['target', '_blank']); // add new attribute
    } else {
      // eslint-disable-next-line no-param-reassign
      tokens[index].attrs[attrIndex][1] = '_blank'; // replace value of existing attr
    }
    return defaultRule(tokens, index, options, env, self); // pass token to default renderer.
  };
};

const patchHtmlBlockRule = (defaultRule) => {
  return (tokens, index, options, env, self) => {
    let processedTokens = tokens;

    // Why we do not minify HTML?
    // https://webitel.atlassian.net/browse/WTEL-5112
    // https://webitel.atlassian.net/browse/WTEL-4472

    return defaultRule(processedTokens, index, options, env, self); // pass token to default renderer.
  };
};

export default (md) => {
  // Remember old renderer, if overridden, or proxy to default renderer
  const defaultLinkOpenRule = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => (
    self.renderToken(tokens, idx, options)
  ));

  md.renderer.rules.link_open = patchLinkOpenRule(defaultLinkOpenRule);

  const defaultHtmlBlockRule = md.renderer.rules.html_block || ((tokens, idx, options, env, self) => (
    self.renderToken(tokens, idx, options)
  ));

  md.renderer.rules.html_block = patchHtmlBlockRule(defaultHtmlBlockRule);
};
