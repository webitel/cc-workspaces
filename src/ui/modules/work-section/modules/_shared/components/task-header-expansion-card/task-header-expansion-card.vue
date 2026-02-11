<template>
  <wt-expansion-card class="task-header-expansion-card">
    <template #title>
      <wt-avatar :username="username"/>
      <a
        v-if="props.contact?.id"
        :href="contactLink"
        class="task-header-expansion-card__title"
        target="_blank"
      >
        {{ props.contact.name }}
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

import WtExpansionCard from '@webitel/ui-sdk/components/wt-expansion-card/wt-expansion-card'
import QueueNameChip from '../queue-name-chip/queue-name-chip.vue';

const store  = useStore();

const props = withDefaults(
  defineProps<{
    username?: string;
    phoneNumber?: string;
    queueName?: string;
    contact: {
      id?: string;
      name?: string;
    }
  }>(),
  {
    username: '',
    phoneNumber: '',
    contact: {},
  });
const username = computed(() => props.contact.name || props.username);

const contactLink = computed(() =>
  store.getters['ui/infoSec/client/contact/CONTACT_LINK'](props.contact.id)
);

</script>

