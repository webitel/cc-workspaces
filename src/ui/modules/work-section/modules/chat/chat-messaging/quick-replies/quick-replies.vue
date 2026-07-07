<template>
  <div class="quick-replies">
    <div class="quick-replies__header">
      <div class="quick-replies__title-wrapper">
        <wt-icon
          icon="quick-replies"
          color="info"
        ></wt-icon>
        <p class="quick-replies__title typo-body-1-bold">
          {{ $t('objects.quickReplies.quickReplies', 1) }}</p>
      </div>
      <wt-icon-btn
        icon="close--filled"
        @click="close"
      >

      </wt-icon-btn>
    </div>

    <wt-loader v-if="isLoading && !replies.length" />

    <wt-empty
      v-if="!isLoading && !replies.length"
      :image="emptyPic"
      class="quick-replies__empty"
      :text="$t('objects.quickReplies.quickRepliesEmpty')"
    >
    </wt-empty>

    <chat-helper-list
      v-if="replies.length"
      :list="replies"
      :next="hasNextReplies"
      :loading="isLoading"
      @select="select"
      @handle-next="loadNextReplies"
    />
  </div>
</template>

<script
  setup
  lang="ts"
>
import { QuickRepliesAPI } from '@webitel/api-services/api';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

import ChatHelperList from '../components/chat-helper-list.vue';
import { ChatHelperItem } from '../types/ChatHelperItem.types';
import EmptyPicDark from './assets/emptyDark.svg';
import EmptyPicLight from './assets/emptyLight.svg';

const props = defineProps<{
	search?: string;
}>();

const emit = defineEmits<{
	close: [];
	select: [
		item: ChatHelperItem,
	];
}>();

const replies = ref<ChatHelperItem[]>([]);
const isLoading = ref(false);
const hasNextReplies = ref(false);
const page = ref(1);

const store = useStore();

const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);
const emptyPic = computed(() =>
	darkMode.value ? EmptyPicDark : EmptyPicLight,
);

const callQuickReply = async (params = {}): Promise<void> => {
	const repliesParams = {
		...params,
		page: page.value,
		restrictToAgent: true,
		sort: '+agent_priority',
	};
	try {
		isLoading.value = true;
		const { items, next } = await QuickRepliesAPI.getList(repliesParams);
		replies.value = [
			...replies.value,
			...items,
		];
		hasNextReplies.value = next;
	} catch (error) {
		throw new Error('Error fetching quick replies:', error);
	} finally {
		isLoading.value = false;
	}
};

const close = () => {
	emit('close');
};

const select = (item) => {
	emit('select', item);
};

const loadNextReplies = async () => {
	if (isLoading.value || !hasNextReplies.value) return;
	page.value++;
	isLoading.value = true;
	setTimeout(async () => {
		// timeout to avoid loader blinking
		await callQuickReply(
			props.search
				? {
						search: props.search,
					}
				: {},
		);
	}, 500);
};

onMounted(() => callQuickReply());

watch(
	() => props.search,
	(search: string | undefined) => {
		replies.value = [];
		page.value = 1;
		callQuickReply(
			search
				? {
						search,
					}
				: {},
		);
	},
);
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.quick-replies {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  height: 100%;

  &__header {
    display: flex;
    margin-bottom: var(--spacing-sm);
  }

  &__title-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: var(--spacing-xs);
  }


  &__empty {
    width: 100%;
  }
}
</style>
