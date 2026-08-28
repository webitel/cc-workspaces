<template>
  <div
    class="contact-card-phones"
    :class="[`contact-card-phones--${props.size}`]"
  >
    <wt-inline-add-panel
      v-if="isAdding"
      class="contact-card-phones__add-form"
      :direction="props.size === ComponentSize.SM ? 'column' : 'row'"
      :disabled-add-action="!newPhone.type?.id || !newPhone.number"
      @reset="closeAdding"
      @submit="savePhone"
    >
      <template>
          <wt-input-text
            v-model:model-value="newPhone.number"
            :placeholder="t('reusable.phoneNumber')"
            class="contact-card-phones__input"
          />
          <wt-single-select
            v-model:model-value="newPhone.type"
            :placeholder="t('objects.communicationType', 1)"
            :search-method="getCommunicationType"
            class="contact-card-phones__select"
          />
      </template>
    </wt-inline-add-panel>

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

<script setup lang="ts">
import { CommunicationsAPI } from '@webitel/api-services/api';
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { WtInlineAddPanel } from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { EngineCommunicationChannels } from 'webitel-sdk';
import { useContactStore } from '../../store/contact';

const { t } = useI18n();
const contactStore = useContactStore();
const { addNumberToContact } = contactStore;

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		contact: WebitelContactsContact;
		isAdding?: boolean;
	}>(),
	{
		size: ComponentSize.MD,
		isAdding: false,
	},
);

const emit = defineEmits<{
	'close-adding': [];
	'phone-added': [];
}>();

const newPhone = ref<{
	number: string;
	type: any;
	primary: boolean;
}>({
	number: '',
	type: null,
	primary: false,
});

const phones = computed(() => props.contact?.phones?.data || []);

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

	await addNumberToContact(newPhoneData);
	closeAdding();
};

const getCommunicationType = async (params) =>
	CommunicationsAPI.getLookup({
		...params,
		channel: EngineCommunicationChannels.Phone,
	});

watch(
	() => props.isAdding,
	(isAdding) => {
		if (isAdding) {
			newPhone.value = {
				number: '',
				type: null,
				primary: phones.value.length === 0,
			};
		}
	},
);
</script>

<style lang="scss" scoped>
.contact-card-phones {
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

  &__input,
  &__select {
    flex: 1;
  }
}
</style>
