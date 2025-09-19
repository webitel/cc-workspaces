import widgetsAPIRepository from '../../ui/modules/widget-bar/api/WidgetsAPIRepository';
import chatplanAPIRepository from './agent-workspace/endpoints/chatplans/ChatplansAPIRepository';
import communicationsAPIRepository
  from './agent-workspace/endpoints/communications/CommunicationsAPIRepository';
import historyAPIRepository from './agent-workspace/endpoints/history/HistoryAPIRepository';
import usersAPIRepository from './agent-workspace/endpoints/users/UsersAPIRepository';
import queuesApiRepository from '@webitel/ui-sdk/api/clients/queues/queues'
import agentsAPIRepository from '@webitel/ui-sdk/api/clients/agents/agents'

const APIRepository = {
  history: historyAPIRepository,
  communications: communicationsAPIRepository,
  users: usersAPIRepository,
  widgets: widgetsAPIRepository,
  chatplans: chatplanAPIRepository,
  agents: agentsAPIRepository,
  queues: queuesApiRepository,
};

export default APIRepository;
