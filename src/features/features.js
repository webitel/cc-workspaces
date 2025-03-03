import status from './modules/agent-status/agent-status.js';
import call from './modules/call/call.js';
import chat from './modules/chat/chat.js';
import globals from './modules/global-handlers/global-handlers.js';
import member from './modules/member/member.js';
import notifications from './modules/notifications/notifications.js';
import job from './modules/job/job.js';
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
