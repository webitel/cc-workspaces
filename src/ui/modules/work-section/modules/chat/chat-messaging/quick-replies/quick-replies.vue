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

      <quick-replies-list
        v-if="!isLoading && replies.length"
        :replies="replies"
        @select="select"
      />
    </div>
  </wt-replace-transition>
</template>

<script setup>
import { QuickRepliesAPI } from '@webitel/api-services/api';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import QuickRepliesList from './quick-replies-list.vue';
import EmptyPicLight from './assets/emptyLight.svg';
import EmptyPicDark from './assets/emptyDark.svg';

const props = defineProps({
  replies: {
    type: Object,
    required: true,
  },
  search: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'select']);

const replies = ref([]);
const isLoading = ref(false);

const store = useStore();

const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);
const emptyPic = computed(() => (darkMode.value ? EmptyPicDark : EmptyPicLight));

const callQuickReply = async (params = {}) => {
  try {
    isLoading.value = true;
    const { items } = await QuickRepliesAPI.getList(params);
    replies.value = items;
  } catch (error) {
    console.error('Error fetching quick replies:', error);
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  emit('close');
};

const select = (text) => {
  emit('select', text);
};

onMounted(() => callQuickReply());

watch(() => props.search, (search) => {
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
