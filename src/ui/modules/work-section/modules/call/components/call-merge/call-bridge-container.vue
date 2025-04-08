<template>
  <lookup-item-container>
    <template #search>
      <div></div>
    </template>
    <template #subtitle>{{ $t('bridge.activeCalls') }}</template>
    <template #content>
      <merge-lookup-item
        v-for="(item) of bridgeList"
        :key="item.id"
        :item="item"
        @input="bridge"
      ></merge-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapActions, mapGetters,mapState } from 'vuex';

import MergeLookupItem from '../../../_shared/components/lookup-item/merge-lookup-item.vue';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';

export default {
  name: 'CallTransferContainer',
  components: { LookupItemContainer, MergeLookupItem },

  computed: {
    ...mapState('features/call', {
      callList: (state) => state.callList,
    }),
    ...mapGetters('features/call', {
      callOnWorkspace: 'CALL_ON_WORKSPACE',
    }),

    bridgeList() {
      return this.callList.filter(
        (call) => call !== this.callOnWorkspace,
      );
    },
  },

  methods: {
    ...mapActions('features/call', {
      bridge: 'BRIDGE',
    }),
  },
};
</script>

<style lang="scss" scoped>

</style>
