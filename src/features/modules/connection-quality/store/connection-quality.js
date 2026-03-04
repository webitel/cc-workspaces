import { createBaseStoreModule } from '@webitel/ui-sdk/store';
import { ConnectionQualityLevels } from '../../../types/ConnectionQualityLevel.enum.ts';

const state = {
	latency: 0,
	rtp: null,
};

const getters = {
	LATENCY: (state) => {
		return state.latency;
	},
	LATENCY_LEVEL: (state) => {
		if (state.latency > 300) return ConnectionQualityLevels.Low;
		if (state.latency >= 150) return ConnectionQualityLevels.Medium;
		return ConnectionQualityLevels.High;
	},
	RTP: (state) => state.rtp,
};

const connectionQuality = createBaseStoreModule({
	state,
	getters,
});

export default connectionQuality;
