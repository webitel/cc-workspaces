import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatMediaStore = defineStore('features/chat/chatMedia', () => {
  const mediaView = ref<any>(null);

  const openMedia = (message: any) => { mediaView.value = message; };
  const closeMedia = () => { mediaView.value = null; };
  const initializeChatPlayers = ({ player, chat }: { player?: any; chat: any }) => { chat.players = player ? [player] : []; };
  const attachPlayerToChat = ({ player, chat }: { player: any; chat: any }) => {
    if (chat.players) chat.players.push(player); else initializeChatPlayers({ player, chat });
    player.on('play', () => { pauseAllChatPlayersExcept({ player, chat }); });
  };
  const cleanChatPlayers = ({ chat }: { chat: any }) => { delete chat.players; };
  const pauseAllChatPlayersExcept = ({ player, chat }: { player: any; chat: any }) => {
    chat.players.forEach((chatPlayer: any) => { if (chatPlayer.id !== player.id) chatPlayer.pause(); });
  };

  return {
    mediaView,
    openMedia,
    closeMedia,
    initializeChatPlayers,
    attachPlayerToChat,
    cleanChatPlayers,
    pauseAllChatPlayersExcept,
  };
});


