<template>
  <section class="active-queue-container">
    <wt-search-bar
      v-if="isSearchVisible"
      class="active-queue-container__search-bar"
      :size="size"
      :value="searchQuery"
      :placeholder="searchPlaceholder"
      full-width
      debounce
      @input="setSearchQuery"
      @focus="resizeQueuePanel(false)"
    />
    <task-queue-container
      :empty="isEmpty"
    >
      <wt-loader v-if="isSearchLoading" />
      <div
        v-else-if="isSearchEmpty"
        class="active-queue-container__empty-wrap"
      >
        <wt-empty
          :size="'sm'"
          :image="emptySearchImage"
          :text="t('emptySearch.text')"
          class="active-queue-container__empty"
        />
      </div>
      <template v-else>
        <div
          v-for="(task, index) of taskList"
          :key="task.id"
          class="active-queue-container__chat"
        >
          <component
            :is="getComponent(task)"
            :task="task"
            :opened="task.id === taskOnWorkspace.id"
            :size="size"
            @click="openTask(task)"
          />
          <wt-divider v-if="taskList.length > index + 1"/>
        </div>
      </template>
      <load-more-button v-show="next" :load-more="loadMore" />
    </task-queue-container>
  </section>
</template>

<script setup>
import emptySearchDark from '@webitel/ui-sdk/src/modules/TableComponentModule/_internals/assets/empty-filters-dark.svg';
import emptySearchLight from '@webitel/ui-sdk/src/modules/TableComponentModule/_internals/assets/empty-filters-light.svg';
import { computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import LoadMoreButton from '../../../../../../_shared/components/load-more-button.vue';
import { usePanelSizeController } from '../../../../../../composables/usePanelSizeController';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ClosedPreview from '../closed-queue/closed-queue-preview.vue';
import ActivePreview from './active-queue-preview.vue';

const props = defineProps({
	size: {
		type: String,
		default: 'md',
	},
});

const { resizeQueuePanel } = usePanelSizeController();

const { t } = useI18n();
const store = useStore();

const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);
const emptySearchImage = computed(() =>
	darkMode.value ? emptySearchDark : emptySearchLight,
);

// wt-search-bar falls back to default "Search" on falsy placeholder, so use a space for sm
const searchPlaceholder = computed(() =>
	props.size === 'sm' ? ' ' : t('queueSec.chat.searchByUsername'),
);
const activeChatsNamespace = 'features/chat/active';
const searchNamespace = 'features/chat/active/search';
const closedChatsNamespace = 'features/chat/closed/unprocessed';

const taskOnWorkspace = computed(
	() => store.getters['workspace/TASK_ON_WORKSPACE'],
);

const activeChats = computed(
	() => store.getters['features/chat/active/VISIBLE_CHAT_LIST'],
);
const unprocessedClosedChats = computed(
	() => store.state.features.chat.closed.unprocessed.chatsList,
);

/**
 * @author @OleksandrPalonnyi
 * [WTEL-9955](https://webitel.atlassian.net/browse/WTEL-9955)
 * chats in the post-processing window already deduped against unprocessedClosedChats
 * see postProcessing/VISIBLE_LIST
 * */
const postProcessingChats = computed(
	() => store.getters['features/chat/postProcessing/VISIBLE_LIST'],
);
const searchQuery = computed(
	() => store.state.features.chat.active.search.query,
);
const isSearchActive = computed(
	() => store.getters[`${searchNamespace}/IS_SEARCH_ACTIVE`],
);
const isSearchLoading = computed(
	() => store.getters[`${searchNamespace}/IS_SEARCH_LOADING`],
);
const searchResults = computed(
	() => store.getters[`${searchNamespace}/SEARCH_RESULTS`],
);
const setSearchQuery = (value) =>
	store.dispatch(`${searchNamespace}/SET_QUERY`, value);

onUnmounted(() => store.dispatch(`${searchNamespace}/RESET_SEARCH`));

const taskList = computed(() => {
	if (isSearchActive.value) return searchResults.value;

	return [
		...activeChats.value,
		...postProcessingChats.value,
		...unprocessedClosedChats.value,
	];
});

const isSearchVisible = computed(
	() => taskList.value.length > 0 || isSearchActive.value,
);

const isSearchEmpty = computed(
	() =>
		isSearchActive.value && !taskList.value.length && !isSearchLoading.value,
);

const isEmpty = computed(
	() => !taskList.value.length && !isSearchLoading.value,
);

const nextActiveChats = computed(
	() => store.getters['features/chat/active/HAS_MORE'],
);
const nextClosedChats = computed(
	() => store.state.features.chat.closed.unprocessed.next,
);
const next = computed(
	() => !isSearchActive.value && !isEmpty.value && nextActiveChats.value,
);

const loadNextActiveChats = () =>
	store.dispatch(`${activeChatsNamespace}/LOAD_NEXT_ACTIVE_CHATS`);
const loadClosedChatsList = () =>
	store.dispatch(`${closedChatsNamespace}/LOAD_UNPROCESSED_CHATS`);
const loadNextClosedChats = () =>
	store.dispatch(`${closedChatsNamespace}/LOAD_NEXT_UNPROCESSED_CHATS`);

// active chats first, closed ones only after active pages run out
const loadMore = () =>
	nextActiveChats.value ? loadNextActiveChats() : loadNextClosedChats();

const isClosedTask = (task) => Boolean(task.closedAt && task.closeReason);

const getComponent = (task) =>
	isClosedTask(task) ? ClosedPreview : ActivePreview;
const openTask = async (task) =>
	isClosedTask(task)
		? await store.dispatch('features/chat/closed/OPEN_CLOSED_CHAT', task)
		: await store.dispatch('features/chat/OPEN_CHAT', task);

loadClosedChatsList();
</script>

<style scoped>
.active-queue-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.active-queue-container__search-bar {
  max-width: 100%;
  padding-top: var(--spacing-xs);
}

.active-queue-container__chat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.active-queue-container__empty-wrap {
  width: 100%;
}

.active-queue-container__empty-wrap .active-queue-container__empty {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: var(--spacing-sm);
  gap: var(--spacing-xs);
}
</style>
