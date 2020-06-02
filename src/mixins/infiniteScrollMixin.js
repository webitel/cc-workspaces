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
  }),

  mounted() {
    this.isMounted = true;
    this.loadInitialList();
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
    async loadInitialList() {
      this.page = 1;
      this.dataList = await this.loadDataList();
    },

    async loadNext() {
      const response = await this.loadDataList();
      this.dataList = [...this.dataList, ...response];
    },

    async loadDataList() {
      const params = {
        page: this.page,
        size: this.size,
        search: this.search,
      };
      if (this.fields) params.fields = this.fields;
      if (this.sort) params.sort = this.sort;
      const response = await this.fetch(params);
      this.isNext = response.next;
      return response.items;
    },

    handleIntersect() {
      if (this.isNext) {
        this.page += 1;
        this.loadNext();
      }
    },

    fetch() {
    },
  },
};
