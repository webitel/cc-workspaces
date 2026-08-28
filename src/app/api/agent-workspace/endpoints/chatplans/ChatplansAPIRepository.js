import { ChatplansAPI } from '@webitel/api-services/api';

const chatplanAPIRepository = {
	getChatplans: (params) => ChatplansAPI.getList(params),
};

export default chatplanAPIRepository;
