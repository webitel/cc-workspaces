<template>
  <div
    class="chat-message-avatar"
  >
    <wt-avatar
      v-if="showAvatar"
      :src="avatarPic"
      size="sm"
    ></wt-avatar>
  </div>
</template>

<script>
import botAvatar from '../../../../../_shared/assets/avatars/bot-avatar.svg';
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-avatar',
  mixins: [chatMessageDetailMixin],
  props: {
    bot: {
      type: Boolean,
      default: false,
    },
    showAvatar: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    avatarPic() {
      return this.bot ? botAvatar : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-avatar {
  pointer-events: none; // prevents dragging to upload file area
}
</style>
