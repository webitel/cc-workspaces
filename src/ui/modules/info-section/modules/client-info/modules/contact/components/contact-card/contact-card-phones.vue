<template>
  <div
    class="contact-card-phones"
    :class="[`contact-card-phones--${props.size}`]"
  >
    <div
      v-if="isAdding"
      class="contact-card-phones__add-form"
    >
      <wt-input
        v-model="newPhone.number"
        :label="t('reusable.phoneNumber')"
        class="contact-card-phones__input"
      />
      <wt-select
        v-model="newPhone.type"
        :label="t('objects.communicationType', 1)"
        :search-method="getCommunicationType"
        class="contact-card-phones__select"
      />
      <div class="contact-card-phones__actions">
        <wt-icon-btn
          icon="tick"
          size="md"
          :disabled="!newPhone.type"
          @click="savePhone"
        />
        <wt-icon-btn
          icon="close"
          @click="closeAdding"
        />
      </div>
    </div>

    <ul
      v-if="phones.length"
      class="contact-card-phones__list"
    >
      <li
        v-for="({ id, number, type, primary }, idx) of phones"
        :key="id"
        class="contact-card-phones__item"
      >
        <wt-divider v-if="idx" />
        <div class="contact-card-phones__wrapper">
          <div class="contact-card-phones__inner">
            <p>{{ number }}</p>
            <wt-icon
              v-if="primary"
              icon="tick"
              color="success"
            ></wt-icon>
          </div>
          <p>{{ type.name }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CommunicationsAPI } from '@webitel/api-services/api';
import { EngineCommunicationChannels } from 'webitel-sdk';
import { useStore } from 'vuex';


const { t } = useI18n();
const store = useStore();

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
    required: true,
  },
  isAdding: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close-adding', 'phone-added']);

const newPhone = ref({
  number: '',
  type: null,
  primary: false,
});

const phones = computed(() => props.contact?.phones || []);

const closeAdding = () => {
  newPhone.value = {
    number: '',
    type: null,
    primary: false,
  };
  emit('close-adding');
};

const savePhone = async () => {
  if (!newPhone.value.number || !newPhone.value.type) return;

  const newPhoneData = {
    number: newPhone.value.number,
    primary: newPhone.value.primary,
    type: newPhone.value.type,
  };

  await store.dispatch('ui/infoSec/client/contact/ADD_NUMBER_TO_CONTACT', newPhoneData);
  closeAdding();
};

const getCommunicationType = async (params) => CommunicationsAPI.getLookup({
  ...params,
  channel: EngineCommunicationChannels.Phone }
)



watch(() => props.isAdding, (isAdding) => {
  if (isAdding) {
    newPhone.value = {
      number: '',
      type: null,
      primary: phones.value.length === 0,
    };
  }
});

</script>

<style lang="scss" scoped>
.contact-card-phones {
  &__add-form {
    display: flex;
    gap: var(--spacing-xs);
    align-items: flex-end;
  }

  &__input {
    flex: 1;
  }

  &__select {
    flex: 1;
  }

  &__actions {
    display: flex;
    gap: var(--spacing-xs);

    button {
      background: var(--dp-16-surface-color);
      padding: var(--spacing-xs);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: var(--spacing-xs);
    align-items: center;
  }

  &__inner {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;
  }

  &__type {
    display: flex;
    align-items: center;

    p {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
  }

  &--sm {
    .contact-card-phones__wrapper {
      display: block;
    }

    .contact-card-phones__add-form {
      flex-direction: column;
      align-items: stretch;
    }

    .contact-card-phones__actions {
      justify-content: center;
    }
  }
}
</style>
