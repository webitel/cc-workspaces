// solution is based on https://github.com/theomessin/vue-chat-scroll/blob/1.x/src/directives/v-chat-scroll.js

const scrollToBottom = (el) => {
  if (typeof el.scroll === 'function') {
    el.scroll({ top: el.scrollHeight });
  } else {
    // eslint-disable-next-line no-param-reassign
    el.scrollTop = el.scrollHeight;
  }
};

let isScrolled = false;
let mutationObserver = null;

const scrollEventHandler = (event) => {
  const el = event.target;
  isScrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight;
};

const chatScroll = {
  bind: (el, binding) => {
    el.addEventListener('scroll', scrollEventHandler);

    mutationObserver = new MutationObserver(() => {
      // eslint-disable-next-line no-unused-vars
      const config = binding.value || {};

     if (!isScrolled) scrollToBottom(el);
    });
    mutationObserver.observe(el, { childList: true, subtree: true });
  },

  inserted: (el, binding) => {
    // eslint-disable-next-line no-unused-vars
    const config = binding.value || {};
    scrollToBottom(el);
  },

  unbind: (el) => {
    el.removeEventListener('scroll', scrollEventHandler);
    mutationObserver.disconnect();
  },
};

export default chatScroll;
