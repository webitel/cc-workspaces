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
        <div class="contact-card-emails__content">
          <wt-input-text
            v-model:model-value="newEmail.email"
            class="contact-card-emails__input"
            :v="$v.newEmail.email"
            :label="t('vocabulary.emails')"
            required
          />
          <wt-select
            v-model="newEmail.type"
            required
            :v="$v.newEmail.type"
            class="contact-card-emails__select"
            :label="t('objects.communicationType', 1)"
            :search-method="getCommunicationType"
          />
        </div>
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
				required,
				email,
			},
			type: {
				required,
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
				primary: !!emails.value.length,
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

  &--sm {
    .contact-card-emails__content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }

  &__content {
    display: flex;
    width: 100%;
    gap: var(--spacing-xs);
  }

  &__input,
  &__select {
    flex: 1;
  }
}
</style>
