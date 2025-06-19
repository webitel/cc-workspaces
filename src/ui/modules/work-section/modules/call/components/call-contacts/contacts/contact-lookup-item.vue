<template>
  <lookup-item>
    <template #before>
      <a :href="contactLink(item.id)" target="_blank">
        <wt-avatar
          :size="size"
          :username="item.name"
        />
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
      <wt-raunded-action
        :disabled="!item.phones.length"
        :size="size"
        :loading="showLoader"
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
      />
    </template>
  </lookup-item>
</template>

<script>
import { mapGetters } from 'vuex';

import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import lookupItemMixin from '../../../../_shared/components/lookup-item/mixins/lookupItemMixin';
import ContactCommunicationItem from './contact-communication-item.vue';

export default {
  name: 'ContactLookupItem',
  components: { ContactCommunicationItem},
  mixins: [lookupItemMixin, sizeMixin],
  emits: [
    'call',
  ],
  data: () => {
    return {
      showLoader: false,
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
      if (this.showLoader) return;

      this.showLoader = true;
      this.$emit('call', { number: number || this.primaryPhoneNumber });
      this.showLoader = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-lookup-item__title {
  color: var(--text-main-color);
}
</style>
