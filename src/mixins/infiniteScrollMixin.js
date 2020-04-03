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
    handleIntersect() {
      this.page += 1;
      this.loadNext();
    },
  },
};
