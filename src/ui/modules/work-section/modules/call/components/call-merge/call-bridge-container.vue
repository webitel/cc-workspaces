<template>
  <lookup-item-container>
    <template v-slot:search>
      <div></div>
    </template>
    <template v-slot:subtitle>{{ $t('bridge.activeCalls') }}</template>
    <template v-slot:content>
      <merge-lookup-item
        v-for="(item) of bridgeList"
        :item="item"
        :key="item.id"
        @input="bridge"
      ></merge-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import MergeLookupItem from '../../../_shared/components/lookup-item/merge-lookup-item.vue';

export default {
  name: 'call-transfer-container',
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
