import { ChatActions } from 'webitel-sdk';
import endChatMedia from '../../../../public/media/end-chat.wav';
import newChatMedia from '../../../../public/media/new-chat.wav';
import newMessageMedia from '../../../../public/media/new-message.wav';

const callHandler = (context) => (action, chat) => {
  switch (action) {
    case ChatActions.UserInvite:
      context.dispatch('HANDLE_INVITE_ACTION', chat);
      break;
    case ChatActions.Message:
      context.dispatch('HANDLE_MESSAGE_ACTION', chat);
      break;
    case ChatActions.Decline:
      break;
    case ChatActions.Leave:
      break;
    case ChatActions.Close:
      context.dispatch('PLAY_NOTIFICATION_SOUND', endChatMedia);
      context.dispatch('SHOW_NOTIFICATION', 'Chat is closed');
      break;
    case ChatActions.Destroy:
      context.dispatch('HANDLE_DESTROY_ACTION', chat);
      break;
    default:
    // console.log('default', action);
  }
};

const actions = {
  PLAY_NOTIFICATION_SOUND: (context, sound) => {
    new Audio(sound).play().then();
  },

  SUBSCRIBE_CHATS: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    await client.subscribeChat(callHandler(context), null);
    const chatList = client.allConversations();
    if (chatList.length) context.dispatch('SET_CHAT_LIST', chatList);
  },

  HANDLE_INVITE_ACTION: (context, chat) => {
    context.dispatch('PLAY_NOTIFICATION_SOUND', newChatMedia);
    context.dispatch('SHOW_NOTIFICATION', 'New chat');
    context.dispatch('ADD_CHAT', chat);
  },

  HANDLE_MESSAGE_ACTION: (context, chat) => {
    const message = chat.messages[chat.messages.length - 1];
    if (!message.member?.self) {
      context.dispatch('PLAY_NOTIFICATION_SOUND', newMessageMedia);
      context.dispatch('SHOW_NOTIFICATION', `New ${message.type} from ${message.member?.name}`);
    }
    context.dispatch('CHAT_INSERT_TO_START', chat);
  },

  HANDLE_DESTROY_ACTION: (context, chat) => {
    context.commit('REMOVE_CHAT', chat);
    context.dispatch('RESET_WORKSPACE');
  },

  SHOW_NOTIFICATION: async (context, notificationText) => {
    context.dispatch('INCREASE_NOTIFICATIONS_COUNT');
    const notification = new Notification(notificationText);

    document.querySelector('.workspace').addEventListener('click', () => {
      context.dispatch('RESET_NOTIFICATION_COUNT');
    });

    setTimeout(() => {
      notification.close();
    }, 2000);
  },
};

export default {
  actions,
};
