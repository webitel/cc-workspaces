<template>
  <wt-expansion-card
    class="task-header-expansion-card"
    :collapsed="props.collapsed"
  >
    <template #header>
      <div class="task-header-expansion-card__title-wrapper">
        <wt-avatar
          size="xs"
          :username="avatarTitle"
        />

        <div class="task-header-expansion-card__title">
          <a
            v-if="displayName?.contactName && contactLink"
            :href="contactLink"
            target="_blank"
            class="task-header-expansion-card__link">
            {{ displayName?.contactName }}</a>
          <span
            v-if="!isChat || displayName?.extraNames"
            class="task-header-expansion-card__extra"
          >{{ taskTitle }}</span>
        </div>

      </div>
    </template>

    <template #body>
      <div class="task-header-expansion-card__info-wrapper">
        <p>{{ props.phoneNumber }}</p>

        <queue-name-chip
          v-if="props.queueName"
          :name="props.queueName"
          clamped
        />
      </div>
    </template>
  </wt-expansion-card>
</template>

<script setup lang="ts">
import { WtAvatar } from '@webitel/ui-sdk/components';
import WtExpansionCard from '@webitel/ui-sdk/components/wt-expansion-card/wt-expansion-card.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { CallDirection } from 'webitel-sdk';
import type { ChatContact } from '../../types/ChatContact.types';
import QueueNameChip from '../queue-name-chip/queue-name-chip.vue';

const store = useStore();

interface DisplayChatName {
	contactName?: string | null;
	extraNames?: string;
	fullName?: string;
}

const props = withDefaults(
	defineProps<{
		username: string | DisplayChatName;
		phoneNumber?: string;
		queueName?: string;
		contact?: ChatContact;
		direction?: CallDirection;
		collapsed?: boolean;
		hideNumber?: boolean;
		isChat?: boolean;
	}>(),
	{
		queueName: '',
		phoneNumber: '',
		contact: null,
		collapsed: false,
		hideNumber: false,
		isChat: false,
	},
);

const { t } = useI18n();

const displayName = computed<DisplayChatName | null>(() =>
	typeof props.username === 'object' && props.username ? props.username : null,
);

const chatTitle = computed(() => {
	const name = displayName.value;
	if (name?.extraNames) {
		return (name.contactName ? ', ' : '') + name.extraNames;
	} else if (name?.fullName === 'unknown') {
		return t('workspaceSec.taskHeaderExpansionCard.unknownContact');
	}
	return name?.fullName;
});

const taskTitle = computed(() => {
	if (props.isChat) return chatTitle.value;
	if (!props.username) {
		return t('workspaceSec.taskHeaderExpansionCard.unknownContact');
	}
	return props.username;
});

const avatarTitle = computed(
	() =>
		props.contact?.name ||
		displayName.value?.fullName ||
		(typeof props.username === 'string' ? props.username : ''),
);

const contactLink = computed(() =>
	store.getters['ui/infoSec/client/contact/READ_ONLY_CONTACT_LINK'](
		props.contact?.etag,
	),
);
</script>

<style scoped>
.task-header-expansion-card {
  align-items: center;
}

.task-header-expansion-card__title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--content-wrapper-gap);
  min-width: 0;
}

.task-header-expansion-card__title-wrapper .wt-avatar {
  flex: 1 0 auto;
}

.task-header-expansion-card__title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  color: var(--text-main-color);
}

.task-header-expansion-card__link:hover {
  text-decoration: underline;
}

.task-header-expansion-card__info-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--content-wrapper-gap);
}

.task-header-expansion-card__extra{
  cursor: default;
}
</style>

