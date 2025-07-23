import { ref, nextTick } from 'vue';

const VARIABLES_REGEX = /\$\{([\w.]+)\}/g //search variables in ${value} format

export function useQuickReplies({ emit, variables = []}) {
  const search = ref('');

  function open() {
    emit('handle-quick-replies', true);
  }

  function close() {
    // author @Lera24
    // https://webitel.atlassian.net/browse/WTEL-4923
    // Because quick replies open and close with animation. And need slow change of content
    nextTick();
    setTimeout(() => {
      emit('handle-quick-replies', false);
    }, 300);
  }

  function replaceVariables(text) {
    return text.replace(VARIABLES_REGEX, (match, varName) => {
      return variables[varName] ?? match;
    });
  }

  function select(text) {
    search.value = '';
    close();
    return VARIABLES_REGEX.test(text) ? replaceVariables(text) : text;
  }

  function input({text, draft}) {
    // @author @Lera24
    // [https://webitel.atlassian.net/browse/WTEL-4923]
    // search is text that input after opening quickReplies panel,
    // and chat.draft value is ignored. Necessary when choosing more than 1 reply
    search.value = text ? text.replace(new RegExp(draft, 'g'), '').replace(/\s{2,}/g, ' ').trim() : '';
  }

  return {
    search,

    open,
    close,
    select,
    input,
  };
}
