import status from '../modules/agent-status/agent-status';
import call from '../modules/call/call';
import chat from '../modules/chat/store/chat';
import globals from '../modules/global-handlers/store/global-handlers';
import member from '../modules/member/member';
import notifications from '../modules/notifications/store/notifications';
import reporting from '../modules/reporting/store/post-processing';

const modules = {
  status,
  call,
  chat,
  member,
  reporting,
  globals,
  notifications,
};

export default {
  namespaced: true,
  modules,
};
