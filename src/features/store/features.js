import status from '../modules/agent-status/agent-status';
import call from '../modules/call/call';
import chat from '../modules/chat/store/chat';
import globals from '../modules/global-handlers/store/global-handlers';
import job from '../modules/job/store/job';
import member from '../modules/member/member';
import callNotifications from '../modules/notifications/call/store/call.js';
import chatNotifications from '../modules/notifications/chat/store/chat.js';
import jobNotifications from '../modules/notifications/job/store/job.js';
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
  callNotifications,
  chatNotifications,
  jobNotifications,
  swController,
};

export default {
  namespaced: true,
  modules,
};
