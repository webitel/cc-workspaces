import status from '../modules/agent-status/agent-status';
import call from '../modules/call/call';
import chat from '../modules/chat/store/chat';
import globals from '../modules/global-handlers/store/global-handlers';
import member from '../modules/member/member';
import notifications from '../modules/notifications/store/notifications';

const modules = {
  status,
  call,
  chat,
  member,
  globals,
  notifications,
};

export default {
  namespaced: true,
  modules,
};
