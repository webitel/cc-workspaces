<template>
  <div
    class="contact-card-emails"
    :class="[`contact-card-emails--${props.size}`]"
  >
    <wt-inline-add-panel
      v-if="isAdding"
      class="contact-card-emails__add-form"
      :direction="props.size === ComponentSize.SM ? 'column' : 'row'"
      :disabled-add-action="!newEmail.type?.id || !newEmail.email || v$.$invalid"
      @reset="closeAdding"
      @submit="saveEmail"
    >
      <template>
          <wt-input-text
            v-model:model-value="newEmail.email"
            :v="emailValidation"
            class="contact-card-emails__input"
            :placeholder="t('vocabulary.emails')"
          />
          <wt-single-select
            v-model:model-value="newEmail.type"
            class="contact-card-emails__select"
            :placeholder="t('objects.communicationType', 1)"
            :search-method="getCommunicationType"
          />
      </template>
    </wt-inline-add-panel>
    <ul>
      <li
        v-for="({ id, email, type, primary }, idx) of emails"
        :key="id"
        class="contact-card-emails__item"
      >
        <wt-divider v-if="idx"></wt-divider>
        <div class="contact-card-emails__wrapper">
          <div class="contact-card-emails__inner">
            <p>{{ email }}</p>
            <wt-icon
              v-if="primary"
              icon="tick"
              color="success"
            ></wt-icon>
          </div>
          <p>{{ type?.name }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { email } from '@vuelidate/validators';
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
const { addEmailToContact } = contactStore;

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		contact?: WebitelContactsContact;
		isAdding?: boolean;
	}>(),
);

const emit = defineEmits<{
	'close-adding': [];
	'phone-added': [];
}>();

const emails = computed(() => props.contact?.emails?.data || []);

const newEmail = ref<{
	email: string;
	type: any;
	primary: boolean;
}>({
	email: '',
	type: null,
	primary: false,
});

const v$ = useVuelidate(
	computed(() => ({
		newEmail: {
			email: {
				email,
			},
		},
	})),
	{
		newEmail,
	},
	{
		$autoDirty: true,
	},
);

v$.value.$touch();

// vuelidate's generated validation-state type doesn't narrow cleanly here
const emailValidation = computed(() => (v$.value as any).newEmail?.email);

const closeAdding = () => {
	newEmail.value = {
		email: '',
		type: null,
		primary: false,
	};
	emit('close-adding');
};

const saveEmail = async () => {
	if (!newEmail.value.email || !newEmail.value.type) return;

	const newEmailData = {
		email: newEmail.value.email,
		primary: newEmail.value.primary,
		type: newEmail.value.type,
	};

	await addEmailToContact(newEmailData);
	closeAdding();
};

const getCommunicationType = async (params) =>
	CommunicationsAPI.getLookup({
		...params,
		channel: EngineCommunicationChannels.Email,
	});

watch(
	() => props.isAdding,
	(isAdding) => {
		if (isAdding) {
			newEmail.value = {
				email: '',
				type: null,
				primary: emails.value.length === 0,
			};
		}
	},
);
</script>

<style lang="scss" scoped>
.contact-card-emails {
  &__item {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: var(--spacing-xs);
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
