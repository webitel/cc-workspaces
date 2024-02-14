<template>
  <lookup-item>
    <template v-slot:before>
      <wt-avatar
        :size="size"
        :username="item.name.commonName"
      ></wt-avatar>
    </template>

    <template v-slot:title>
      {{ item.name.commonName }}
    </template>

    <template v-slot:subtitle>
      {{ primaryPhoneNumber }}
    </template>

    <template v-slot:after>
      <wt-rounded-action
        :size="size"
        icon="call--filled"
        color="success"
        rounded
        @click="handleInput"
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
      return this.item.phones?.data.find(phone => phone.primary === true).number;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
