<template>
  <div
    class="chat-message-avatar"
  >
    <img
      v-if="showAvatar"
      :src="avatarPic"
      alt="avatar"
      class="chat-message-avatar__img"
    >
  </div>
</template>

<script>
import botAvatar from '../../../../../_shared/assets/avatars/bot-avatar.svg';
import defaultAvatar from '../../../../../_shared/assets/avatars/default-avatar.svg';
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
      return this.bot ? botAvatar : defaultAvatar;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  pointer-events: none; // prevents dragging to upload file area

  &__img {
    height: 100%;
  }
}
</style>
