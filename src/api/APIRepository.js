import historyAPIRepository from './agent-workspace/history/HistoryAPIRepository';
import communicationsAPIRepository
  from './agent-workspace/communications/CommunicationsAPIRepository';
import usersAPIRepository from './agent-workspace/users/UsersAPIRepository';
import widgetsAPIRepository from './agent-workspace/widgets/WidgetsAPIRepository';
import chatplanAPIRepository from './agent-workspace/chatplans/ChatplansAPIRepository';

const APIRepository = {
  history: historyAPIRepository,
  communications: communicationsAPIRepository,
  users: usersAPIRepository,
  widgets: widgetsAPIRepository,
  chatplans: chatplanAPIRepository,
};

export default APIRepository;
