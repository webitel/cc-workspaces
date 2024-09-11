<template>
  <lookup-item>
    <template v-slot:before>
      <a :href="crmContactLink" target="_blank">
        <wt-avatar
          :size="size"
          :username="item.name"
        ></wt-avatar>
      </a>
    </template>

    <template v-slot:title>
      <a class="contact-lookup-item__title" :href="crmContactLink" target="_blank">
        {{ item.name }}
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
    primaryPhoneNumber() {
      return this.item.phones?.find((phone) => phone.primary === true)?.number;
    },
    crmContactLink() {
      return `${import.meta.env.VITE_CRM_URL}/contacts/${this.item.id}/communications`;
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
