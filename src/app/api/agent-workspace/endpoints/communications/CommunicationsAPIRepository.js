import { CommunicationsAPI } from '@webitel/api-services/api';

const communicationsAPIRepository = {
	getList: (params) => CommunicationsAPI.getList(params),
};

export default communicationsAPIRepository;
