<template>
  <lookup-item>
    <template v-slot:before>
      <a :href="contactLink(item.id)" target="_blank">
        <wt-avatar
          :size="size"
          :username="item.name.commonName"
        ></wt-avatar>
      </a>
    </template>

    <template v-slot:title>
      <a
        class="contact-lookup-item__title"
        :href="contactLink(item.id)"
        target="_blank">
        {{ item.name.commonName }}
      </a>
    </template>

    <template v-slot:subtitle>
      {{ primaryPhoneNumber }}
    </template>

    <template v-slot:after="{ toggle }">
      <wt-rounded-action
        :disabled="!item.phones.length"
        :size="size"
        color="success"
        icon="call--filled"
        rounded
        @click="item.phones.length > 1 ? toggle() : call(item.phones[0])"
      ></wt-rounded-action>
    </template>

    <template
      v-if="item.phones.length > 1"
      v-slot:expansion
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

export default {
  name: 'contact-lookup-item',
  components: { ContactCommunicationItem },
  mixins: [lookupItemMixin, sizeMixin],
  emits: [
    'call',
  ],
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
      this.$emit('call', { number: number || this.primaryPhoneNumber });
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-lookup-item__title {
  color: var(--text-main-color);
}
</style>
