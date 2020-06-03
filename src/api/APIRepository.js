import historyAPIRepository from './agent-workspace/history/HistoryAPIRepository';
import communicationsAPIRepository
  from './agent-workspace/communications/CommunicationsAPIRepository';
import usersAPIRepository from './agent-workspace/users/UsersAPIRepository';
import authAPIRepository from './auth/authAPIRepository';

const APIRepository = {
  history: historyAPIRepository,
  communications: communicationsAPIRepository,
  users: usersAPIRepository,
  auth: authAPIRepository,
};

export default APIRepository;
