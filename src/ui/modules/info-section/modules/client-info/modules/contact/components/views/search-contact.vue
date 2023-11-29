<template>
  <div
    class="search-contact"
    :class="[`search-contact--${props.size}`]"
  >
    <div class="search-contact-wrapper">
      <wt-search-bar
        :value="search"
        @input="search = $event">
      </wt-search-bar>
      <wt-button
        @click="callSearch"
      >
        {{ t('webitelUI.searchBar.placeholder') }}
      </wt-button>
    </div>

    <div class="search-contact-options">
      <wt-radio
        v-for="({ mode, label }) of SearchOptions"
        :key="mode"
        :label="t(label)"
        :value="mode"
        :selected="searchMode"
        @input="searchMode = $event"
      ></wt-radio>
    </div>

    <contacts-list-wrapper
      :list="contactsBySearch"
      @link="linkContact"
    ></contacts-list-wrapper>
<!--    <wt-dummy-->
<!--      v-if="isEmptyData && !isLoading"-->
<!--      :src="dummyPic"-->
<!--      :text="$t('scorecards.emptyWorkspace')"-->
<!--      show-action-->
<!--      @create="create"-->
<!--      class="scorecards__dummy"-->
<!--    ></wt-dummy>-->
    <wt-button
      color="secondary"
      @click="close"
    ></wt-button>
  </div>

</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';
import SearchOptions from '../../enums/SearchOptions.enum';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const emit = defineEmits([
  'close',
]);

const store = useStore();
const { t } = useI18n();

const search = ref('');
const searchMode = ref(SearchOptions[0].mode);
const isLoading = ref(false);

async function callSearch() {
  try {
    isLoading.value = true;
    return store.dispatch(`${props.namespace}/SEARCH_CONTACTS`, { q: search.value, qin: searchMode.value });
  } finally {
    ///?
    isLoading.value = false;
  }
}

const contactsBySearch = computed(() => store.state.ui.infoSec.client.contact.contactsBySearch);

function close() {
  emit('close');
}

function linkContact(contact) {
  store.dispatch(`${props.namespace}/LINK_CONTACT`, contact);
  close();
}
</script>

<style lang="scss" scoped>
.search-contact {
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.search-contact-wrapper {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);

  .wt-search-bar {
    width: 100%;
  }
}

.search-contact-options {
  display: flex;
  gap: var(--spacing-xs);
}

.search-contact-actions {
  display: flex;
  gap: var(--spacing-xs);

  .wt-button {
    width: 100%;
  }
}

.search-contact {
  &--sm {
    .search-contact-options {
      display: block;
    }

    .search-contact-wrapper {
      flex-direction: column;
    }

    .search-contact-actions {
      flex-direction: column;
    }
  }
}
</style>
