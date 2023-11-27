<template>
  <article
    class="contact"
  >
    <wt-expansion-panel>
      <template v-slot:title>{{ $t('infoSec.contacts.client') }}
        <div class="contact-actions">
          <wt-icon-btn
            icon="search"
            @click="changeMode(ContactMode.SEARCH)"
          ></wt-icon-btn>
          <wt-icon-btn
            icon="plus"
            @click="changeMode(ContactMode.ADD)"
          ></wt-icon-btn>
        </div>
      </template>
      <template>
        <add-contact
          v-if="mode === ContactMode.ADD"
          @close="changeMode(ContactMode.VIEW)"
        />
        <search-contact
          v-if="mode === ContactMode.SEARCH"
          @close="changeMode(ContactMode.VIEW)"
        />
        <view-contact
          v-if="mode === ContactMode.VIEW"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import { ref, watch } from 'vue';
import AddContact from './add-contact.vue';
import SearchContact from './search-contact.vue';
import ViewContact from './view-contact.vue';

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

const ContactMode = Object.freeze({
  ADD: 'add',
  SEARCH: 'search',
  VIEW: 'view',
});

const mode = ref(ContactMode.VIEW);

const changeMode = (newMode) => {
  mode.value = newMode;
};

function initializeContact() {
  // dispatch action to get contacts
}

watch(() => props.task, () => {
  initializeContact();
}, { immediate: true });
</script>

<style lang="scss" scoped>
.contact {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  &-actions {
    display: flex;
    flex: 1;
    justify-content: end;
    gap: calc(var(--spacing-xs) / 2);
  }
}
</style>
