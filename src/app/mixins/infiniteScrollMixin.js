import Observer from '../components/utils/scroll-observer.vue';

export default {
  components: {
    Observer,
  },

  data: () => ({
    dataPage: 1,
    dataSize: 20,
    dataSearch: '',
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
      if (this.dataPage === 1) {
        this.dataList = items; // if component is re-rendered, reset persistent storage data
      } else {
        this.dataList = [...this.dataList, ...items];
      }
    },

    resetData() {
      this.dataPage = 1;
      this.loadDataList();
    },

    async loadDataList() {
      if (!this.dataList.length) this.isLoading = true;
      const params = this.collectParams();
      // both items and data because contacts return { data }, and other endpoints return { items }
      const { items, data, next } = await this.fetch(params);
      this.isNext = next;
      const sortedData = await this.groupAndSortByDate(items || data);
      this.setData(sortedData);
      this.dataPage += 1;
      this.isLoading = false;
    },

    formatDate(timestamp) {
      const date = new Date(parseInt(timestamp));
      return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
    },

    isToday(date) {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },

    async loadDataListHistory() {
      if (!this.dataList.length) this.isLoading = true;
      const params = this.collectParams();
      const { items, data, next } = await this.fetch(params);

      this.isNext = next;
      this.setData(this.groupAndSortByDate(items || data));
      this.dataPage += 1;
      this.isLoading = false;
    },

    groupAndSortByDate(data) {
       const groupedData = {};
       data.forEach(item => {
         const date = new Date(parseInt(item.createdAt));
         let dateKey;

         this.isToday(date) ? dateKey = this.$t('history.today'):
         dateKey = this.formatDate(item.createdAt);

         if (!groupedData[dateKey]) groupedData[dateKey] = [];
         groupedData[dateKey].push(item);
       });

       const result = Object.keys(groupedData).map(key => {
         return {
           groupName: key,
           groupData: groupedData[key].sort((a, b) => b.createdAt - a.createdAt)
         };
       });

       return result;
},

    async handleIntersect() {
      if (this.isNext) {
        await this.loadDataList();
      }
    },

    collectParams() {
      const params = {
        page: this.dataPage,
        size: this.dataSize,
        search: this.dataSearch,
      };
      if (this.dataFields) params.fields = this.dataFields;
      if (this.dataSort) params.sort = this.dataSort;
      if (this.dataFilters) params.filters = this.dataFilters;
      return params;
    },

    fetch() {
    },
  },
};
