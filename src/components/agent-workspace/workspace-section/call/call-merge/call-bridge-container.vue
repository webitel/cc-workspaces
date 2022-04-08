<template>
  <div class="ws-worksection">
    <p class="ws-worksection__list-instruction">{{$t('bridge.activeCalls')}}</p>
    <div class="ws-worksection__list">
      <merge-lookup-item
        v-for="(item) of callList"
        :item="item"
        :key="item.id"
        @input="bridge"
      ></merge-lookup-item>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import MergeLookupItem from '../../shared/lookup-item/merge-lookup-item.vue';

  export default {
    name: 'call-transfer-container',
    components: { MergeLookupItem },

    computed: {
      ...mapState('call', {
        callList: (state) => state.callList,
      }),

      callList() {
        return this.$store.state.call.callList.filter(
          (call) => call !== this.$store.state.call.callOnWorkspace,
        );
      },
    },

    methods: {
      ...mapActions('call', {
        bridge: 'BRIDGE',
      }),
    },
  };
</script>

<style lang="scss" scoped>

</style>
