<template>
  <lookup-item>
    <template v-slot:before>
      <a :href="crmContactLink" target="_blank">
        <wt-avatar
          :size="size"
          :username="item.name.commonName"
        ></wt-avatar>
      </a>
    </template>

    <template v-slot:title>
      {{ item.name.commonName }}
    </template>

    <template v-slot:subtitle>
      {{ primaryPhoneNumber }}
    </template>

    <template v-slot:after="{ toggle }">
      <wt-rounded-action
        v-if="item.phones.length"
        :size="size"
        color="success"
        icon="call--filled"
        rounded
        @click="item.phones.length > 1 ? toggle() : call()"
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
        @call="call"
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
      return this.item.phones?.find(phone => phone.primary === true)?.number;
    },
    crmContactLink() {
      return `${import.meta.env.VITE_CRM_URL}/contacts/${this.item.id}`;
    },
  },
  methods: {
    call(item = this.item) {
      this.$emit('call', item);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
