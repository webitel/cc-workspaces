<template>
  <form
    class="add-contact"
    :class="[`add-contact--${props.size}`]"
  >
    <div>
      <wt-input-text
        v-model:model-value="draft.name.commonName"
        :label="t('reusable.name')"
        :v="nameValidation"
        required
        prevent-trim
      />
      <wt-input-text
        :model-value="draft.phones?.[0]?.number || ''"
        :label="t('reusable.phoneNumber')"
        prevent-trim
        @update:model-value="updatePhoneNumber"
      />
      <wt-input-text
        :model-value="draft.emails?.[0]?.email || ''"
        :label="t('vocabulary.emails')"
        prevent-trim
        @update:model-value="updateEmail"
      />
      <wt-single-select
        :model-value="draft.timezones?.[0]?.timezone"
        :label="t('date.timezone', 1)"
        :search-method="TimezonesAPI.getLookup"
        @update:model-value="draft.timezones[0] = { etag: '', timezone: $event }"
      />
      <wt-single-select
        :model-value="draft.managers?.[0]?.user"
        :label="t('infoSec.contacts.manager')"
        :search-method="UsersAPI.getLookup"
        @update:model-value="draft.managers[0] = { etag: '', user: $event }"
      />
      <wt-multi-select
        v-model:model-value="draft.labels"
        :label="t('vocabulary.labels', 2)"
        :search-method="LabelsAPI.getList"
        option-label="label"
        data-key="label"
        allow-custom-values
				chips-view
      />
      <wt-textarea
        v-model:model-value="draft.about"
        :label="t('vocabulary.description')"
      ></wt-textarea>
    </div>
    <div class="add-contact__actions">
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
      <wt-button
        :loading="isLoading"
        :disabled="v$.$invalid"
        @click="save"
      >
        {{ t('reusable.add') }}
      </wt-button>
    </div>
  </form>

</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { ContactsInputContact } from '@webitel/api-services/gen/models';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { EngineCommunicationChannels } from 'webitel-sdk';
import CommunicationsAPI from '../../../../../../../../../app/api/agent-workspace/endpoints/communications/CommunicationsAPIRepository';
import UsersAPI from '../../../../../../../../../app/api/agent-workspace/endpoints/users/UsersAPIRepository';
import { useUserinfoStore } from '../../../../../../../userinfo/userinfoStore';
import LabelsAPI from '../../api/LabelsAPI';
import TimezonesAPI from '../../api/TimezonesAPI';
import { useContactStore } from '../../store/contactStore';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
	}>(),
	{
		size: ComponentSize.MD,
	},
);

const emit = defineEmits<{
	close: [];
}>();

const store = useStore();
const contactStore = useContactStore();
const { isLoading } = storeToRefs(contactStore);
const { addContact } = contactStore;
const { t } = useI18n();

const draft = ref<ContactsInputContact>({
	name: {
		commonName: '',
	},
	timezones: [],
	managers: [],
	phones: [],
	labels: [],
	about: '',
	emails: [],
});

const defaultCommunications = ref<
	Array<{
		id: string;
		name: string;
		channel: string;
		code: string;
	}>
>([]);

const v$ = useVuelidate(
	computed(() => ({
		draft: {
			name: {
				commonName: {
					required,
				},
			},
		},
	})),
	{
		draft,
	},
	{
		$autoDirty: true,
	},
);

v$.value.$touch();

// vuelidate's generated validation-state type doesn't narrow cleanly here
const nameValidation = computed(
	() => (v$.value as any).draft?.name?.commonName,
);

const userinfoStore = useUserinfoStore();
const { userInfo, userId } = storeToRefs(userinfoStore);

function close() {
	emit('close');
}

function updatePhoneNumber(phoneNumber: string) {
	if (!draft.value.phones[0]) {
		draft.value.phones[0] = {
			number: phoneNumber,
			primary: true,
			type: {},
		};
	} else {
		draft.value.phones[0].number = phoneNumber;
	}
}

function updateEmail(email: string) {
	if (!draft.value.emails[0]) {
		draft.value.emails[0] = {
			email,
			primary: true,
			type: {},
		};
	} else {
		draft.value.emails[0].email = email;
	}
}

async function getDefaultCommunication() {
	const { items } = await CommunicationsAPI.getList({
		channel: [
			EngineCommunicationChannels.Phone,
			EngineCommunicationChannels.Email,
		],
		defaultValue: true,
	});
	defaultCommunications.value = items;
}

async function createCommunication() {
	if (defaultCommunications.value.length) {
		defaultCommunications.value.forEach((communication) => {
			const { id, name, channel, code } = communication;
			if (channel === EngineCommunicationChannels.Phone) {
				if (!draft.value.phones[0]?.number) return;
				draft.value.phones = [
					{
						number: draft.value.phones[0]?.number,
						primary: true,
						// `channel`/`code` aren't part of the input model's lookup
						// type, but the backend accepts them on this field
						type: {
							id,
							name,
							channel,
							code,
						} as any,
					},
				];
			} else if (channel === EngineCommunicationChannels.Email) {
				if (!draft.value.emails[0]?.email) return;
				draft.value.emails = [
					{
						email: draft.value.emails[0]?.email,
						primary: true,
						type: {
							id,
							name,
							channel,
							code,
						} as any,
					},
				];
			}
		});
	}
}

async function save() {
	await createCommunication();
	if (!draft.value.phones[0]?.number) delete draft.value.phones;
	if (!draft.value.emails[0]?.email) delete draft.value.emails;
	await addContact(draft.value);
	store.dispatch('features/chat/closed/processed/LOAD_PROCESSED_CHATS');

	close();
}

function setDefaultManager() {
	draft.value.managers[0] = {
		etag: '',
		user: {
			id: userId.value,
			name: userInfo.value.name,
		},
	};
}

onMounted(() => {
	setDefaultManager();
	getDefaultCommunication();
});
</script>

<style lang="scss" scoped>
.add-contact {
  display: flex;
  gap: var(--spacing-xs);
  flex-direction: column;
  padding: var(--spacing-xs);

  &__actions {
    //position: absolute;
    //bottom: 0;
    //left: 0;
    width: 100%;
    display: flex;
    gap: var(--spacing-xs);

    .wt-button {
      width: 100%;
    }
  }

  &--sm {
    .add-contact__actions {
      flex-direction: column;
    }
  }
}
</style>
