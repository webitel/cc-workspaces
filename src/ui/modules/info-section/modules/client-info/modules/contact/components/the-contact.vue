<template>
  <article
    class="contact typo-body-1 wt-scrollbar"
  >
    <wt-expansion-panel>
      <template #title>{{ t('infoSec.contacts.client') }}</template>
      <template #actions="{ open }">
        <div
          v-if="isTaskActive"
          class="contact-actions"
        >
          <wt-icon-btn
            icon="search"
            @click.stop="openView(open, ContactMode.SEARCH)"
          />
          <wt-icon-btn
            icon="plus"
            @click.stop="openView(open, ContactMode.ADD)"
          />
        </div>
      </template>
      <template #default>
          <add-contact
            v-if="mode === ContactMode.ADD"
            :size="props.size"
            :namespace="namespace"
            @close="changeMode(ContactMode.VIEW)"
          />
          <search-contact
            v-if="mode === ContactMode.SEARCH"
            :size="props.size"
            :namespace="namespace"
            @add="changeMode(ContactMode.ADD)"
            @close="changeMode(ContactMode.VIEW)"
          />
          <view-contact
            v-if="mode === ContactMode.VIEW"
            :mode="mode"
            :size="props.size"
            :namespace="namespace"
            @add="changeMode(ContactMode.ADD)"
          />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import WorkspaceStates from '../../../../../../../enums/WorkspaceState.enum.js';
import ContactMode from '../enums/ContactMode.enum';
import AddContact from './views/add-contact.vue';
import SearchContact from './views/search-contact.vue';
import ViewContact from './views/view-contact.vue';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
	size: {
		type: String,
		default: 'md',
	},
});

const store = useStore();
const { t } = useI18n();
const mode = ref(ContactMode.VIEW);
const namespace = 'ui/infoSec/client/contact';
const workspaceState = computed(
	() => store.getters['workspace/WORKSRACE_STATE'],
);
const isTaskActive = computed(() => store.getters['workspace/IS_TASK_ACTIVE']);

const taskId = computed(() => {
	switch (workspaceState.value) {
		case WorkspaceStates.CHAT:
			return props.task.conversationId;
		case WorkspaceStates.CALL:
			return props.task.id;
		default:
			return null;
	}
});

const changeMode = (newMode) => {
	mode.value = newMode;
};

function initializeContact() {
	return store.dispatch(`${namespace}/INITIALIZE_CONTACT`);
}

function loadContact(contactId) {
	return store.dispatch(`${namespace}/LOAD_CONTACT`, contactId);
}

function openView(open, mode) {
	open();
	changeMode(mode);
}

/*
  we need to watch both for task itself and for task.contactId, because we want to handle 2 cases:
  1. contactId appears after linking contact to task => we need to load this contact
  2. task is changes => we need to reset contact

  but we need to prevent both of these cases handlers fire at one time because if task changes, task.contactId changes too
  so there would be 2 calls of loadContact() and initializeContact() at one time
 */

watch(
	[
		() => taskId.value,
		() => props.task.contactId,
		() => props.task.bridgedId, // to reset contact if bridgedId changes
	],
	(
		[taskId, contactId, bridgedId],
		[prevTaskId, prevContactId, prevBridgedId],
	) => {
		if (taskId !== prevTaskId || !taskId || bridgedId !== prevBridgedId) {
			changeMode(ContactMode.VIEW);
			initializeContact();
			return;
		}

		if (taskId === prevTaskId && contactId !== prevContactId) {
			if (contactId) {
				loadContact(contactId);
				changeMode(ContactMode.VIEW);
			}
		}
	},
	{
		immediate: true,
	},
);
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.contact {
  display: flex;
  flex-direction: column;

  &-actions {
    display: flex;
    flex: 1;
    justify-content: end;
    gap: var(--spacing-xs);
  }
}
</style>
