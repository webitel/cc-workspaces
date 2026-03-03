import { createBaseStoreModule } from '@webitel/ui-sdk/store';
import { CONNECTION_QUALITY_LEVELS } from '../../../types/connection-quality-level.enum';

const state = {
	latency: 0,
	rtp: null,
};

const getters = {
	LATENCY: (state) => {
		return state.latency;
	},
	LATENCY_LEVEL: (state) => {
		if (state.latency > 300) return CONNECTION_QUALITY_LEVELS.Low;
		if (state.latency >= 150) return CONNECTION_QUALITY_LEVELS.Medium;
		return CONNECTION_QUALITY_LEVELS.High;
	},
	RTP: (state) => state.rtp,
};

const connectionQuality = createBaseStoreModule({
	state,
	getters,
});

export default connectionQuality;
