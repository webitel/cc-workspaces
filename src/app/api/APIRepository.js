import historyAPIRepository from './agent-workspace/endpoints/history/HistoryAPIRepository';
import communicationsAPIRepository
  from './agent-workspace/endpoints/communications/CommunicationsAPIRepository';
import usersAPIRepository from './agent-workspace/endpoints/users/UsersAPIRepository';
import widgetsAPIRepository from '../../ui/modules/widget-bar/api/WidgetsAPIRepository';
import chatplanAPIRepository from './agent-workspace/endpoints/chatplans/ChatplansAPIRepository';

const APIRepository = {
  history: historyAPIRepository,
  communications: communicationsAPIRepository,
  users: usersAPIRepository,
  widgets: widgetsAPIRepository,
  chatplans: chatplanAPIRepository,
};

export default APIRepository;
