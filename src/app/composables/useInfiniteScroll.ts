import { onMounted, reactive, toRefs } from 'vue';

/**
 * Composable that mirrors behavior of infiniteScrollMixin without modifying it.
 * Consumer must pass a fetchFn that returns { items?, data?, next }
 */
export default function useInfiniteScroll(options = {}) {
  const state = reactive({
    dataList: options.initialList || [],
    dataPage: 1,
    dataSize: options.size || 20,
    dataSearch: options.initialSearch || '',
    rootMargin: options.rootMargin || '200px',
    isMounted: false,
    isNext: true,
    isLoading: true,
    dataFields: options.fields,
    dataSort: options.sort,
    dataFilters: options.filters,
  });

  const setData = (items) => {
    if (state.dataPage === 1) {
      state.dataList = items;
    } else {
      state.dataList = [...state.dataList, ...items];
    }
  };

  const collectParams = () => {
    const params = {
      page: state.dataPage,
      size: state.dataSize,
      search: state.dataSearch,
    };
    if (state.dataFields) params.fields = state.dataFields;
    if (state.dataSort) params.sort = state.dataSort;
    if (state.dataFilters) params.filters = state.dataFilters;
    return params;
  };

  const loadDataList = async () => {
    if (!state.dataList.length) state.isLoading = true;
    const params = collectParams();
    const { items, data, next } = await options.fetchFn(params);
    state.isNext = next;
    setData(items || data || []);
    state.dataPage += 1;
    state.isLoading = false;
  };

  const handleIntersect = async () => {
    if (state.isNext) {
      await loadDataList();
    }
  };

  const resetData = () => {
    state.dataPage = 1;
    loadDataList();
  };

  onMounted(() => {
    state.isMounted = true;
  });

  return {
    ...toRefs(state),
    setData,
    collectParams,
    loadDataList,
    handleIntersect,
    resetData,
  };
}
