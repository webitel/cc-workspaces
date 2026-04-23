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
        <a
          v-if="props.isTitleLinked && contactLink"
          :href="contactLink"
          class="task-header-expansion-card__title"
          target="_blank"
        >
          {{ taskTitle }}
        </a>
        <span
          v-else
          class="task-header-expansion-card__title"
        >
          {{ taskTitle }}
        </span>
      </div>
    </template>

    <template #body>
      <div class="task-header-expansion-card__info-wrapper">
        <p>{{ phoneNumberLabel }}</p>

        <queue-name-chip
          v-if="props.queueName"
          :name="props.queueName"
        />
      </div>
    </template>
  </wt-expansion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { WtExpansionCard, WtAvatar } from '@webitel/ui-sdk/components';
import { ChannelType, CallDirection } from 'webitel-sdk';
import { useI18n } from 'vue-i18n';

import QueueNameChip from '../queue-name-chip/queue-name-chip.vue';
import type { ChatContact } from '../../types/ChatContact.types';

const store = useStore();

const props = withDefaults(
	defineProps<{
		username: string;
		phoneNumber?: string;
		queueName?: string;
		isTitleLinked?: boolean;
		contactId?: ChatContact['id'];
		direction?: CallDirection;
		collapsed?: boolean;
		hideNumber?: boolean;
	}>(),
	{
		queueName: '',
		phoneNumber: '',
		isTitleLinked: false,
		contactId: '',
		collapsed: false,
		hideNumber: false,
	},
);

const { t } = useI18n();

const taskTitle = computed(() => {
	if (!props.username) {
		return t('workspaceSec.taskHeaderExpansionCard.unknownContact');
	}

	return props.username;
});

const avatarTitle = computed(() => props.username);

const phoneNumberLabel = computed(() => {
	if (props.hideNumber) {
		return t('workspaceSec.taskHeaderExpansionCard.hiddenNumber');
	}

	return props.phoneNumber;
});

const contactLink = computed(() =>
	store.getters['ui/infoSec/client/contact/CONTACT_LINK'](props.contactId),
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

.task-header-expansion-card__title:hover {
  text-decoration: underline;
}

.task-header-expansion-card__info-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--content-wrapper-gap);
}
</style>

