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
  }),

  mounted() {
    this.loadDataList();
  },

  computed: {
    obsOptions() {
      const root = this.$refs['scroll-wrap'];
      return {
        root,
        rootMargin: this.rootMargin,
      };
    },
  },

  methods: {
    handleIntersect() {
      this.page += 1;
      this.loadDataList();
    },
  },
};
