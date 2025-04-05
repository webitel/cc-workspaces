import status from './modules/agent-status/store/agent-status.js';
import call from './modules/call/store/call.js';
import chat from './modules/chat/store/chat.js';
import globals from './modules/global-handlers/store/global-handlers.js';
import member from './modules/member/store/member.js';
import notifications from './modules/notifications/store/notifications.js';
import job from './modules/job/store/job.js';
import swController from './modules/sw-controller/sw-controller.js';

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
