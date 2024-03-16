const localStorageKey = 'workspace/queue-sec/expansion-state';

export function useCachedExpansionState({ entity }) {
  const getKey = (expansion) => `${localStorageKey}/${entity}/${expansion}`;

  const cacheExpansionState = ({ expansion, state }) => {
    return localStorage.setItem(getKey(expansion), state);
  }

  const restoreExpansionState = ({ expansion }) => {
    return localStorage.getItem(getKey(expansion)) === 'false';
  }

  return {
    cacheExpansionState,
    restoreExpansionState,
  };
}
