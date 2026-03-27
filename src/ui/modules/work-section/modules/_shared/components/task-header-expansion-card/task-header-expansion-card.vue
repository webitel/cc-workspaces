<template>
  <wt-expansion-card
    class="task-header-expansion-card"
    :collapsed="props.collapsed"
  >
    <template #header>
      <div class="task-header-expansion-card__title-wrapper">
        <wt-avatar
          size="xs"
          :username="taskTitle"
        />
        <a
          v-if="props.isTitleLinked && contactLink"
          :href="contactLink"
          class="task-header-expansion-card__title"
          target="_blank"
        >
          {{ taskTitle }}
        </a>
        <span v-else>
          {{ taskTitle }}
        </span>
      </div>
    </template>
    <template #body>
    <div class="task-header-expansion-card__info-wrapper">
      <p>{{ props.phoneNumber }}</p>
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
		contactId?: ChatContact[id];
		direction?: CallDirection;
		collapsed?: boolean;
	}>(),
	{
		queueName: '',
		phoneNumber: '',
		isTitleLinked: false,
		contactId: '',
		collapsed: false,
	},
);

const { t } = useI18n();

const showOutboundCallText = computed(() => {
	return props.direction === CallDirection.Outbound && !props.queueName;
});

// https://webitel.atlassian.net/browse/WTEL-9047?focusedCommentId=735052
const taskTitle = computed(() => {
	if (showOutboundCallText.value) {
		return t(`channel.type.${ChannelType.OutCall}`); // ui-sdk locale
	}
	return props.username;
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
}

.task-header-expansion-card__title-wrapper .wt-avatar {
  flex: 1 0 auto;
}

.task-header-expansion-card__title {
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

