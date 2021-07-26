import historyAPIRepository from './agent-workspace/history/HistoryAPIRepository';
import communicationsAPIRepository
  from './agent-workspace/communications/CommunicationsAPIRepository';
import usersAPIRepository from './agent-workspace/users/UsersAPIRepository';
import widgetsAPIRepository from './agent-workspace/widgets/WidgetsAPIRepository';

const APIRepository = {
  history: historyAPIRepository,
  communications: communicationsAPIRepository,
  users: usersAPIRepository,
  widgets: widgetsAPIRepository,
};

export default APIRepository;
