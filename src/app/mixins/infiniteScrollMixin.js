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

	methods: {
		setData(items) {
			if (this.dataPage === 1) {
				this.dataList = items; // if component is re-rendered, reset persistent storage data
			} else {
				this.dataList = [
					...this.dataList,
					...items,
				];
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
			this.setData(items || data);
			this.dataPage += 1;
			this.isLoading = false;
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

		fetch() {},
	},
};
