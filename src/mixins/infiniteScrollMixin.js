import Observer from '../components/utils/scroll-observer.vue';
import Search from '../components/utils/search-input.vue';

export default {
  components: {
    Observer,
    Search,
  },

  data: () => ({
    page: 1,
    size: 20,
    search: '',
    rootMargin: '200px',
    isMounted: false, // isMounted recomputes observerOptions with $ref, when component renders
    isNext: true,
    isLoading: true,
  }),

  mounted() {
    this.isMounted = true;
  },

  computed: {
    obsOptions() {
      if (this.isMounted) {
        const root = this.$refs['scroll-wrap'];
        return {
          root,
          rootMargin: this.rootMargin,
        };
      }
      return null;
    },
  },

  methods: {
    setData(items) {
      if (this.page === 1) {
        this.dataList = items; // if component is re-rendered, reset persistent storage data
      } else {
        this.dataList = [...this.dataList, ...items];
      }
    },

    resetData() {
      this.page = 1;
      this.loadDataList();
    },

    async loadDataList() {
      if (!this.dataList.length) this.isLoading = true;
      const params = this.collectParams();
      const { items, next } = await this.fetch(params);
      this.isNext = next;
      this.setData(items);
      this.page += 1;
      this.isLoading = false;
    },

    async handleIntersect() {
      if (this.isNext) {
        await this.loadDataList();
      }
    },

    collectParams() {
      const params = {
        page: this.page,
        size: this.size,
        search: this.search,
      };
      if (this.fields) params.fields = this.fields;
      if (this.sort) params.sort = this.sort;
      if (this.filters) params.filters = this.filters;
      return params;
    },

    fetch() {
    },
  },
};
