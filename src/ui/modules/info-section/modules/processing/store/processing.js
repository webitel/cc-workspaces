import form from '../modules/form/store/form';
import reporting from '../modules/reporting/store/reporting';

const getters = {
	ALLOW_PROCESSING: (s, g, rS, rootGetters) =>
		rootGetters['workspace/TASK_ON_WORKSPACE'].allowReporting,
};

export default {
	namespaced: true,
	getters,
	modules: {
		form,
		reporting,
	},
};
