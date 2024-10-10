// solution is based on https://github.com/theomessin/vue-chat-scroll/blob/1.x/src/directives/v-chat-scroll.js
// plus (images) https://github.com/SamuelLin/vue-chat-scroll-image/blob/master/src/directives/v-chat-scroll-image.js

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

    mutationObserver = new MutationObserver((event) => {
      // eslint-disable-next-line no-unused-vars
      const config = binding.value || {};

      event.forEach((mutation) => {
        if (!mutation.addedNodes.length) return;
        mutation.addedNodes.forEach((node) => {
        });
      });
      if (!isScrolled) scrollToBottom(el);
      if (isScrolled && el.scrollTop <= 200) el.scrollTop += 200; // prevent scroll to top when we add new items
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
