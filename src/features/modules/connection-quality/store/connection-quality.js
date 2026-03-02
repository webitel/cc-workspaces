import { createBaseStoreModule } from '@webitel/ui-sdk/store';

const state = {
	latency: 0,
	rtp: null,
};

const getters = {
	LATENCY: (state) => {
		return state.latency;
	},
};

const connectionQuality = createBaseStoreModule({
	state,
	getters,
});

export default connectionQuality;
