<template>
  <section class="call-preview-wrap">
    <missed-preview
      v-for="(missed, key) of missedList"
      :call="missed"
      :index="key"
      :key="key"
      @click.native.prevent="openCall(key)"
    ></missed-preview>
  </section>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import MissedPreview from './missed-queue-preview.vue';

  export default {
    name: 'missed-queue-container',
    components: {
      MissedPreview,
    },

    created() {
      this.loadMissedList();
    },

    computed: {
      ...mapState('call/missed', {
        missedList: (state) => state.missedList.filter((item) => item.direction === 'inbound' && !item.answeredAt),
      }),
    },

    methods: {
      ...mapActions('call', {
        openNewCall: 'OPEN_NEW_CALL',
      }),
      ...mapActions('call/missed', {
        loadMissedList: 'LOAD_DATA_LIST',
      }),

      openCall(index) {
        const newNumber = this.missedList[index].from.number;
        this.openNewCall({ newNumber });
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
