<template>
  <div class="ws-worksection">
    <p class="ws-worksection__list-instruction">{{$t('bridge.activeCalls')}}</p>
    <div class="ws-worksection__list">
      <merge-lookup-item
        v-for="(item) of bridgeList"
        :item="item"
        :key="item.id"
        @input="bridge"
      ></merge-lookup-item>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
  import MergeLookupItem from '../../../_shared/components/lookup-item/merge-lookup-item.vue';

  export default {
    name: 'call-transfer-container',
    components: { MergeLookupItem },

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
