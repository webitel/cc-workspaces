<template>
  <wt-replace-transition
    pattern="slide-up"
  >
    <div class="quick-replies">
      <div class="quick-replies__header">
        <div class="quick-replies__title-wrapper">
          <wt-icon
            icon="quick-replies"
            color="info"
          ></wt-icon>
          <p class="quick-replies__title">
            {{ $tc('objects.quickReplies.quickReplies', 1) }}</p>
        </div>
        <wt-icon-btn
          icon="close--filled"
          @click="close"
        >

        </wt-icon-btn>
      </div>

      <wt-loader v-if="isLoading" />

      <wt-empty
        v-if="!isLoading && !replies.length"
        :image="emptyPic"
        class="quick-replies__empty"
        :text="$t('objects.quickReplies.quickRepliesEmpty')"
      >
      </wt-empty>

      <chat-helper-list
        v-if="!isLoading && replies.length"
        :list="replies"
        @select="select"
      />
    </div>
  </wt-replace-transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { QuickRepliesAPI } from '@webitel/api-services/api';
import ChatHelperList from '../components/chat-helper-list.vue';
import EmptyPicLight from './assets/emptyLight.svg';
import EmptyPicDark from './assets/emptyDark.svg';
import { ChatHelperItem } from "../types/ChatHelperItem.types";

const props = defineProps<{
  search?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', item: ChatHelperItem): void;
}>();

const replies = ref<ChatHelperItem[]>([]);
const isLoading = ref(false);

const store = useStore();

const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);
const emptyPic = computed(() => (darkMode.value ? EmptyPicDark : EmptyPicLight));

const callQuickReply = async (params = {}):Promise<void> => {
  try {
    isLoading.value = true;
    const { items } = await QuickRepliesAPI.getList(params);
    replies.value = items;
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

onMounted(() => callQuickReply());

watch(() => props.search, (search: string | undefined) => {
  callQuickReply(search ? { search } : {});
});
</script>

<style lang="scss" scoped>
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

  &__title {
    @extend %typo-body-1-bold;
  }

  &__empty {
    width: 100%;
  }
}
</style>
