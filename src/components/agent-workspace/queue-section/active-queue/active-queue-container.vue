<template>
  <section class="call-preview-wrap">
    <active-preview
      v-for="(call, key) of callList"
      :call="call"
      :index="key"
      :key="key"
      @click.native.prevent="openCall(key)"
    ></active-preview>
  </section>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ActivePreview from './active-queue-preview.vue';

  export default {
    name: 'active-queue-container',
    components: {
      ActivePreview,
    },

    computed: {
      ...mapState('call', {
        callList: (state) => state.callList,
      }),
    },

    methods: {
      ...mapActions('call', {
        openCall: 'OPEN_CALL_ON_WORKSPACE',
      }),
    },
  };
</script>

<style lang="scss" scoped>

</style>
