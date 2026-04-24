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
            :v="v$?.newEmail?.email"
            class="contact-card-emails__input"
            :placeholder="t('vocabulary.emails')"
          />
          <wt-select
            v-model="newEmail.type"
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

<script setup>
import { CommunicationsAPI } from '@webitel/api-services/api';
import { WtInlineAddPanel } from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { EngineCommunicationChannels } from 'webitel-sdk';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';

const { t } = useI18n();
const store = useStore();

const props = defineProps({
	size: {
		type: String,
		default: 'md',
		options: [
			'sm',
			'md',
		],
	},
	contact: {
		type: Object,
	},
	isAdding: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'close-adding',
	'phone-added',
]);

const emails = computed(() => props.contact?.emails);

const newEmail = ref({
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

	await store.dispatch(
		'ui/infoSec/client/contact/ADD_EMAIL_TO_CONTACT',
		newEmailData,
	);
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
