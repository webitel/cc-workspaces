<template>
  <lookup-item>
    <template #before>
      <a :href="contactLink(item.etag)" target="_blank">
        <wt-avatar
          :size="size"
          :username="item.name?.commonName"
        ></wt-avatar>
      </a>
    </template>

    <template #title>
      <a
        class="contact-lookup-item__title"
        :href="contactLink(item.etag)"
        target="_blank">
        {{ item.name?.commonName }}
      </a>
    </template>

    <template #subtitle>
      {{ primaryPhoneNumber }}
    </template>

    <template #after="{ toggle }">
      <wt-rounded-action
        :disabled="!phones.length"
        :size="size"
        :loading="loading"
        color="success"
        icon="call--filled"
        rounded
        @click="handleCallAction(toggle)"
      ></wt-rounded-action>
    </template>

    <template
      v-if="phones.length > 1"
      #expansion
    >
      <contact-communication-item
        v-for="phone in phones"
        :key="phone.id"
        :phone="phone"
        :size="size"
        :loading="loading"
        @call="call(phone)"
      ></contact-communication-item>
    </template>
  </lookup-item>
</template>

<script setup lang="ts">
import type {
	ContactsPhoneNumber,
	WebitelContactsContact,
} from '@webitel/api-services/gen/models';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useContactStore } from '../../../../../../info-section/modules/client-info/modules/contact/store/contact';
import LookupItem from '../../../../_shared/components/lookup-item/lookup-item.vue';
import ContactCommunicationItem from './contact-communication-item.vue';

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
		item: WebitelContactsContact;
		loading?: boolean;
	}>(),
);

const emit = defineEmits<{
	call: [
		payload: {
			number?: string;
			contactId?: string;
		},
	];
}>();

const contactStore = useContactStore();
const { readOnlyContactLink: contactLink } = storeToRefs(contactStore);

const phones = computed<ContactsPhoneNumber[]>(
	() => props.item.phones?.data || [],
);
const primaryPhoneNumber = computed(
	() => phones.value.find((phone) => phone.primary === true)?.number,
);

function call(phone?: ContactsPhoneNumber) {
	emit('call', {
		number: phone?.number || primaryPhoneNumber.value,
		contactId: props.item.id,
	});
}

function handleCallAction(toggle: () => void) {
	if (phones.value.length > 1) {
		toggle();
	} else {
		call(phones.value[0]);
	}
}
</script>

<style lang="scss" scoped>
.contact-lookup-item__title {
  color: var(--text-main-color);
}
</style>
