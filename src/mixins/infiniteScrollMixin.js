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
        async loadInitialList() {
            this.page = 1;
            this.dataList = await this.loadDataList();
        },

        async loadNext() {
            const response = await this.loadDataList();
            this.dataList = [...this.dataList, ...response];
        },

        loadDataList() {
            const params = {
                page: this.page,
                size: this.size,
                search: this.search,
            };
            if (this.fields) params.fields = this.fields;
            if (this.sort) params.sort = this.sort;
            if (this.filters) params.filters = this.filters;
            return this.fetch(params);
        },

        handleIntersect() {
            this.page += 1;
            this.loadNext();
        },

        fetch() {
        },
    },
};
