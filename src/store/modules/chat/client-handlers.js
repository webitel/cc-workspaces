import { ChatActions } from 'webitel-sdk';
import { objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { getCliInstance } from '../../../api/agent-workspace/call-ws-connection';

const chatMock = objSnakeToCamel({
  "title": "my best chat",
  "answered_at": 1606395115000,
  "created_at": 1606395115000,
  "updated_at": 1606395117000,

  "channel": {
    "id": "321321321312",
    "internal": true,
    "name": "Operator",
    "type": "webitel",
    "user_id": 10
  },
  "other_channels": [
    {
      "id": "418ddefc-f5b5-4ede-b53f-6cff12039990",
      "internal": false,
      "name": "Daniil Lohvinov",
      "type": "telegram",
      "user_id": 45
    }
  ],
  "messages": [
    {
      "channel": {
        "internal": false,
        "name": "Daniil Lohvinov",
        "type": "telegram",
        "user_id": 45
      },
      "created_at": 1606395117000,
      "id": 7586,
      "text": "2",
      "type": "text",
      "updated_at": 1606395117000
    },
    {
      "channel": {
        "internal": true,
        "name": "Operator",
        "type": "webitel",
        "user_id": 10
      },
      "created_at": 1606395117000,
      "id": 7587,
      "text": "bla blabla blabla blabla blabla blabla blabla bla",
      "type": "text",
      "updated_at": 1606395117000
    }
  ],
  "state": "active"
});

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
      context.dispatch('HANDLE_CLOSE_ACTION', chat);
      break;
    default:
    // console.log('default', action);
  }
};

const actions = {
  SUBSCRIBE_CHATS: async (context) => {
    const client = await getCliInstance();
    await client.subscribeChat(callHandler(context), null);
    // const chatList = client.allConversations();
    const chatList = client.allConversations;
    // const chatList = [...client.allConversations, chatMock];
    if (chatList.length) context.commit('SET_CHAT_LIST', chatList);
  },

  HANDLE_INVITE_ACTION: (context, chat) => {
    // console.info(JSON.stringify({ ...chat, client: null }));
    context.commit('ADD_CHAT', chat);
  },

  HANDLE_MESSAGE_ACTION: () => {
    // context.commit('ADD_CALL', chat);
  },

  HANDLE_CLOSE_ACTION: (context, chat) => {
    context.commit('REMOVE_CHAT', chat);
    context.dispatch('RESET_WORKSPACE');
  },
};

export default {
  actions,
};
