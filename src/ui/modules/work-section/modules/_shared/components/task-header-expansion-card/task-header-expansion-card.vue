<template>
  <wt-expansion-card class="task-header-expansion-card">
    <template #title>
      <wt-avatar :username="props.username"/>
      <a
        v-if="props.contactId"
        :href="contactLink"
        class="task-header-expansion-card__title"
        target="_blank"
      >
        {{ props.username }}
      </a>
      <span v-else>
        {{ props.username }}
      </span>
    </template>
    <p>{{ props.phoneNumber }}</p>
    <queue-name-chip
      v-if="props.queueName"
      :name="props.queueName"
    />
  </wt-expansion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

import WtExpansionCard from '@webitel/ui-sdk/components/wt-expansion-card/wt-expansion-card';
import QueueNameChip from '../queue-name-chip/queue-name-chip.vue';

const store = useStore();

const props = withDefaults(
	defineProps<{
		username: string;
		phoneNumber?: string;
		queueName?: string;
		contactId?: string;
	}>(),
	{
		queueName: '',
		phoneNumber: '',
		contactId: '',
	},
);

const contactLink = computed(() =>
	store.getters['ui/infoSec/client/contact/CONTACT_LINK'](props.contactId),
);
</script>

<style>
  .task-header-expansion-card__title {
    color: var(--text-main-color);
  }

  .task-header-expansion-card__title:hover {
    text-decoration: underline;
  }
</style>

