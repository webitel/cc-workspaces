<template>
  <div
    :class="{
     'chat-message--right' : isAgentSide,
     'chat-message--md': props.size === 'md'
    }"
    class="chat-message"
  >
    <slot name="before-message" />

    <div class="chat-message__content">
      <div class="chat-message-avatar">
        <wt-avatar
          v-if="props.showAvatar"
          :size="ComponentSize.SM"
          :bot="isBot"
          :username="getClientUsername"
        />
      </div>
      <!--    click.stop prevents focus on textarea and allows to select the message text -->
      <div
        class="chat-message__body"
        :class="{ 'chat-message__body--malware': isFileMalware || isFilePolicyFailed }"
        @click.stop
      >
        <template v-if="hasFileError">
          <message-blocked-error v-if="isFileMalware" />
          <message-size-exceeded-error
            v-else-if="isFileSizeExceeded"
            :agent="isAgentSide"
          />
          <message-file-policy-error
            v-else-if="isFilePolicyFailed"
            @click.stop
          />

          <message-time
            :date="props.message.createdAt"
          />
        </template>

        <template v-else>
          <message-player
            v-if="media"
            :file="props.message.file"
            :type="props.message.file?.mime"
            :size="props.size"
            @initialized="handlePlayerInitialize"
          />
          <message-image
            v-else-if="image"
            :file="props.message.file"
            :type="props.message.file?.mime"
            @open="emit('open-image')"
          />
          <message-document
            v-else-if="documentFile"
            :file="props.message.file"
            :type="props.message.file?.mime"
            :agent="isAgentSide"
          />
          <div
            v-if="props.message?.text"
            class="chat-message-text-wrapper"
          >
            <message-text
              :text="props.message.text"
              :with-timestamp-spacer="true"
              :agent="isAgentSide"
            />

            <message-time
              :date="props.message.createdAt"
            />
          </div>

          <message-time
            v-else
            :date="props.message.createdAt"
          />
        </template>
      </div>
    </div>

    <slot name="after-message" />
  </div>
</template>

<script setup>
import { useChatMessageFile } from '@webitel/ui-chats/ui';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, defineEmits, defineProps } from 'vue';
import { AgentTypes } from '../../../../../../../features/modules/chat/enums/AgentTypes.enum';
import { useUserinfoStore } from '../../../../../userinfo/userinfoStore';
import MessageBlockedError from './components/chat-message-blocked-error.vue';
import MessageDocument from './components/chat-message-document.vue';
import MessageFilePolicyError from './components/chat-message-file-police-error.vue';
import MessageImage from './components/chat-message-image.vue';
import MessagePlayer from './components/chat-message-player.vue';
import MessageSizeExceededError from './components/chat-message-size-exceeded-error.vue';
import MessageText from './components/chat-message-text.vue';
import MessageTime from './components/chat-message-time.vue';

const props = defineProps({
	message: {
		type: Object,
		required: true,
	},
	size: {
		type: String,
		default: ComponentSize.MD,
	},
	showAvatar: {
		type: Boolean,
		default: false,
	},
	username: {
		type: String,
	},
});

const emit = defineEmits([
	'open-image',
	'initialized-player',
]);

const filePolicyError = 'file_policy_fail';

const userinfoStore = useUserinfoStore();
const { userInfo } = storeToRefs(userinfoStore);
const agentName = computed(
	() => userInfo.value.chatName || userInfo.value.name,
);

const isFileSizeExceeded = computed(
	() => props.message.file && !props.message.file?.size,
);

const isFileMalware = computed(() => !!props.message.file?.malware);

const isFilePolicyFailed = computed(
	() =>
		props.message?.variables?.template === filePolicyError ||
		props.message?.context?.template === filePolicyError,
);

const hasFileError = computed(
	() =>
		isFileMalware.value || isFileSizeExceeded.value || isFilePolicyFailed.value,
);

const {
	image,
	media,
	document: documentFile,
} = useChatMessageFile(props.message.file);

const isInternalMember = computed(
	() => props.message.member?.type === AgentTypes.WEBITEL,
);

const isAgent = computed(
	() => props.message.member?.self || isInternalMember.value,
);

const isTransferAgent = computed(
	() => !props.message.member?.self && isInternalMember.value,
);

const isBot = computed(() => {
	const byMemberType = props.message.member?.type === AgentTypes.BOT;
	const byMissingMeta = !props.message.member?.type && !props.message.channelId;
	const byVariables = props.message.variables?.from === AgentTypes.BOT;

	return byMemberType || byMissingMeta || byVariables;
});

const isAgentSide = computed(() => isAgent.value || isBot.value);

const getClientUsername = computed(() => {
	if (isTransferAgent.value) return props.message.member?.name;
	if (isAgent.value) return agentName?.value;
	return props.username || props.message.member?.name;
});

function handlePlayerInitialize(player) {
	emit('initialized-player', {
		player,
	});
}
</script>

<style lang="scss" scoped>
$message-gap: var(--spacing-xs);
$chat-info-gap: var(--spacing-2xs);

.chat-message {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: $chat-info-gap;

  &:last-child {
    margin-bottom: $message-gap;
  }

  &__content {
    display: flex;
    flex: 1;
    min-width: 0;
    line-height: 0; // prevents height difference from its content
    gap: $message-gap;
    margin: 0 var(--spacing-md) 0 var(--spacing-2xs);
  }

  &.chat-message--md {
    .chat-message__main-wrapper {
      max-width: 80%;
    }
  }

  .chat-message-avatar {
    flex: 0 0 var(--spacing-lg);
    pointer-events: none; // prevents dragging to upload file area
  }

  &__body {
    position: relative;
    overflow-wrap: anywhere;
    white-space: pre-line;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius);
    background: var(--p-primary-highlight-color);
    color: var(--primary-on-color);
    place-self: flex-start;
  }

  .chat-message-time {
    margin-top: var(--p-player-chat-message-gap);
  }

  &-text-wrapper {
    .chat-message-time {
      position: absolute;
      right: var(--spacing-xs);
      bottom: var(--chat-message-timestamp-bottom-offset);
      pointer-events: none;
    }
  }

  &--right .chat-message__content {
    flex-direction: row-reverse;
    margin: 0 var(--spacing-2xs) 0 var(--spacing-md);
  }

  &--right {
    .chat-message__body {
      background: var(--p-secondary-hover-color);
      color: var(--secondary-on-color);
      place-self: flex-end;
    }
  }

  &__body--malware,
  &--right &__body--malware {
    background: var(--p-error-highlight-color);
  }
}
</style>
