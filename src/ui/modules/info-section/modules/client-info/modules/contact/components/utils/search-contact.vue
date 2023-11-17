<template>
<div class="search-contact" :class="[`search-contact--${props.size}`]">
  <div>
    <div class="search-contact-wrapper">
      <wt-search-bar
        :value="searchValue"
        debounce
      />
      <wt-button
        @click="searchAction"
      >
        {{ t('webitelUI.searchBar.placeholder') }}
      </wt-button>
    </div>

    <div class="search-contact-options">
      <wt-radio
        v-for="opt of searchModeOptions"
        :key="opt.value"
        :label="opt.text"
        :value="opt"
        :selected="searchModeOptions[0]"
        @input="searchKey = $event"
        outline
      ></wt-radio>
    </div>
  </div>

  <wt-dummy></wt-dummy>
  <div class="search-contact-actions">
    <wt-button
      color="secondary"
      @click="emit('search', {key: searchKey, value: searchValue})"
    >
      {{ t('reusable.back') }}
    </wt-button>
    <wt-button
    >
      {{ t('reusable.add') }}
    </wt-button>
  </div>

</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const searchValue = ref('');
function searchAction() {
  console.log('searchAction');
}
const searchKey = ref('');
const { t } = useI18n();
const searchModeOptions = computed(() => [
  {
    value: 'name',
    text: t('reusable.name'),
  },
  {
    value: 'destination',
    text: t('infoSec.contacts.destination', 1),
  },
  {
    value: 'variables',
    text:  t('vocabulary.variables', 2),
  },
]);

const emit = defineEmits(['input']);

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
});

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
