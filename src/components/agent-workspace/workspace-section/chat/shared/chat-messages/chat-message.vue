<template>
  <div class="chat-message" :class="{'chat-message--right' : isAgentSideMessage }">
    <div class="chat-message__user-pic-wrapper" v-if="!my">
      <img v-if="showUserPic" class="chat-message__user-pic"
           :src="avatarPic"
           alt="client photo">
    </div>
    <!--    click.stop prevents focus on textarea and allows to select the message text -->
    <div class="chat-message__main-wrapper" @click.stop>
      <p
        v-if="text"
        class="chat-message__text"
        v-html="text"
      ></p>
      <div v-if="image" class="chat-message__image" @click="openImage">
        <img
          class="chat-message__image__img"
          :src="image.url"
          :alt="image.name">
      </div>
      <div
        v-else-if="document"
        class="chat-message__document"
        @click="downloadDocument"
      >
        <div class="chat-message__document__icon-wrapper">
          <wt-icon
            class="chat-message__document__icon"
            icon="attach"
            :color="my ? 'primary' : 'contrast'"
          ></wt-icon>
        </div>
        <div class="chat-message__document__info-wrapper">
          <a class="chat-message__document__name" :title="document.name">{{ document.name }}</a>
          <div class="chat-message__document__size">{{ documentSize }}</div>
        </div>
      </div>
    </div>
    <aside class="chat-message__message-info-wrapper">
      <div class="chat-message__sent-at">{{ sentAt }}</div>
      <wt-icon
        v-if="my"
        class="chat-message__status-icon"
        icon="chat-message-status-sent"
        size="sm"
      ></wt-icon>
    </aside>
  </div>
</template>

<script>
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
import linkifyHtml from 'linkifyjs/html';
import { mapActions } from 'vuex';
import botAvatar from '../../../../../../assets/agent-workspace/bot-avatar.svg';
import defaultAvatar from '../../../../../../assets/agent-workspace/default-avatar.svg';

export default {
  name: 'chat-message',
  props: {
    message: {
      type: Object,
      required: true,
    },
    showUserPic: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    my() {
      return !!this.message.member?.self;
    },
    bot() {
      return !this.message.channelId;
    },
    isAgentSideMessage() {
      return this.my || this.bot;
    },
    avatarPic() {
      return this.bot ? botAvatar : defaultAvatar;
    },
    sentAt() {
      return prettifyTime(this.message.createdAt);
    },
    text() {
      if (!this.message.text) return '';
      return linkifyHtml(this.message.text, {
        target: '_blank',
      });
    },
    image() {
      const isImage = this.message.file && this.message.file.mime.includes('image');
      return isImage ? this.message.file : null;
    },
    document() {
      return this.message.file;
    },
    documentSize() {
      if (!this.document) return '';
      return prettifyFileSize(this.document.size);
    },
  },
  methods: {
    ...mapActions('chat', {
      openMedia: 'OPEN_MEDIA',
    }),
    downloadDocument() {
      const a = document.createElement('a');
      a.href = this.document.url;
      a.target = '_blank';
      a.download = this.document.name;
      a.click();
    },
    openImage() {
      this.openMedia(this.message);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message {
  position: relative;
  display: flex;
  max-width: 80%;
  margin-top: 10px;

  .chat-message__main-wrapper {
    max-width: 100%;
    padding: 8px 10px;
    background: var(--chat-client-message-bg-color);
    border-radius: var(--border-radius);

    .chat-message__text {
      @extend %typo-body-2;
      overflow-wrap: break-word;
      white-space: pre-line; // read \n as "new line"

      // reset links inside text
      ::v-deep a {
        color: revert;
        text-decoration: revert;
      }
    }

    .chat-message__image {
      cursor: pointer;

      &__img {
        @extend %typo-body-2;
        width: 100%;
      }
    }

    .chat-message__document {
      display: flex;
      cursor: pointer;

      .chat-message__document__icon-wrapper {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        border-radius: var(--border-radius);
        background: var(--chat-client-attachment-bg-color);
      }

      .chat-message__document__info-wrapper {
        min-height: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .chat-message__document__name {
        @extend %typo-subtitle-2;
        cursor: pointer;
      }

      .chat-message__document__size {
        @extend %typo-caption;
        color: var(--text-outline-color);
      }
    }
  }

  .chat-message__message-info-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    margin-left: 10px;
  }

  .chat-message__sent-at {
    @extend %typo-caption;
    color: var(--text-outline-color);
    white-space: nowrap;
  }

  &--right {
    flex-direction: row-reverse;
    margin-left: auto;

    .chat-message__main-wrapper {
      background: var(--chat-agent-message-bg-color);

      .chat-message__document {
        flex-direction: row-reverse;

        .chat-message__document__icon-wrapper {
          margin-right: 0;
          margin-left: 10px;
          background: var(--chat-agent-attachment-bg-color);
        }
      }
    }

    .chat-message__user-pic-wrapper {
      margin-right: 0;
    }

    .chat-message__message-info-wrapper {
      margin-left: 0;
      margin-right: 10px;
    }
  }
}

.chat-message__user-pic-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;

  .chat-message__user-pic {
    height: 100%;
  }
}
</style>
