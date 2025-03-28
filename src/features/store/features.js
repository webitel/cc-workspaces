import status from '../modules/agent-status/agent-status';
import call from '../modules/call/call';
import chat from '../modules/chat/store/chat';
import globals from '../modules/global-handlers/store/global-handlers';
import job from '../modules/job/store/job';
import member from '../modules/member/member';
import notifications from '../modules/notifications/store/notifications';
import swController from '../modules/sw-controller/store/sw-controller';

const modules = {
  status,
  call,
  chat,
  job,
  member,
  globals,
  notifications,
  swController,
};

export default {
  namespaced: true,
  modules,
};
