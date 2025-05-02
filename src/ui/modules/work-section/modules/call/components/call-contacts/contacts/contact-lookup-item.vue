<template>
  <lookup-item>
    <template #before>
      <a :href="contactLink(item.id)" target="_blank">
        <wt-avatar
          :size="size"
          :username="item.name"
        ></wt-avatar>
      </a>
    </template>

    <template #title>
      <a
        class="contact-lookup-item__title"
        :href="contactLink(item.id)"
        target="_blank">
        {{ item.name }}
      </a>
    </template>

    <template #subtitle>
      {{ primaryPhoneNumber }}
    </template>

    <template #after="{ toggle }">
      <raunded-action
        :disabled="!item.phones.length"
        :size="size"
        :loading="isCallLoading"
        color="success"
        icon="call--filled"
        rounded
        @click="item.phones.length > 1 ? toggle() : call(item.phones[0])"
      />
    </template>

    <template
      #expansion
    >

      <contact-communication-item
        v-for="phone in item.phones"
        :key="phone.id"
        :phone="phone"
        :size="size"
        @call="call(phone)"
      ></contact-communication-item>
    </template>
  </lookup-item>
</template>

<script>
import { mapGetters } from 'vuex';

import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import lookupItemMixin from '../../../../_shared/components/lookup-item/mixins/lookupItemMixin';
import ContactCommunicationItem from './contact-communication-item.vue';
import RaundedAction from '../../../../../../../components/raunded-action.vue';

export default {
  name: 'ContactLookupItem',
  components: { ContactCommunicationItem, RaundedAction },
  mixins: [lookupItemMixin, sizeMixin],
  // props: {
  //   isCallLoading: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  emits: [
    'call',
  ],
  data: () => {
    return {
      isCallLoading: false,
    }
  },
  computed: {
    ...mapGetters('ui/infoSec/client/contact', {
      contactLink: 'CONTACT_LINK',
    }),
    primaryPhoneNumber() {
      return this.item.phones?.find((phone) => phone.primary === true)?.number;
    },
  },
  methods: {
    call({ number } = {}) {
      this.isCallLoading = true;
      this.$emit('call', { number: number || this.primaryPhoneNumber });
      this.isCallLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-lookup-item__title {
  color: var(--text-main-color);
}
</style>
