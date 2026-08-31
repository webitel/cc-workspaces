import { WorkspaceWidgetsAPI } from '@webitel/api-services/api';

const widgetsAPIRepository = {
	getWidgets: () => WorkspaceWidgetsAPI.getWidgets(),
};

export default widgetsAPIRepository;
