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

    <template v-slot:after>
      <wt-rounded-action
          :disabled="isCallActionDisabled"
          :size="size"
          color="success"
          icon="call--filled"
          rounded
          @click="handleCallClick"
      ></wt-rounded-action>
    </template>
  </lookup-item>
</template>

<script>
import lookupItemMixin from './mixins/lookupItemMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'contact-lookup-item',
  mixins: [lookupItemMixin, sizeMixin],
  computed: {
    primaryPhoneNumber() {
      return this.item.phones?.find(phone => phone.primary === true)?.number;
    },
    isCallActionDisabled() {
      return !(!!this.item.phones);
    },
    crmContactLink() {
      return `${import.meta.env.VITE_CRM_URL}/contacts/${this.item.id}`;
    },
  },
  methods: {
    handleCallClick() {
      if (this.item.phones.length > 1) {
        this.$emit('toggleExpansion', this.item)
      } else {
        this.handleInput();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
