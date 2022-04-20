<template>
  <section class="queue-task-container">
    <h3 class="queue-task-container__heading">{{$t('history.today')}}</h3>
    <missed-preview
      v-for="(missed, key) of missedList"
      :call="missed"
      :index="key"
      :key="missed.id"
      @click="openCall"
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
      this.resetNewMissed(); // reset UI flag
    },

    computed: {
      ...mapState('features/call/missed', {
        missedList: (state) => state.missedList,
      }),
    },

    methods: {
      ...mapActions('features/call', {
        openNewCall: 'OPEN_NEW_CALL',
      }),
      ...mapActions('features/call/missed', {
        loadMissedList: 'LOAD_DATA_LIST',
        resetNewMissed: 'RESET_NEW_MISSED',
      }),

      openCall(missed) {
        const newNumber = missed.from.number;
        this.openNewCall({ newNumber });
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '../../../../css/queue-task-container';

  .queue-task-container__heading {
    @extend %typo-body-2;
    text-align: center;
    margin: 10px 0 5px;
    color: var(--text-outline-color);
    background: var(--main-color);
  }
</style>
