<template>
  <section class="queue-task-container">
    <h3 class="queue-task-container__heading">{{$t('history.today')}}</h3>
    <missed-preview
      v-for="(missed, key) of missedList"
      :call="missed"
      :index="key"
      :key="missed.id"
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
      this.resetNewMissed(); // reset UI flag
    },

    computed: {
      ...mapState('call/missed', {
        missedList: (state) => state.missedList,
      }),
    },

    methods: {
      ...mapActions('call', {
        openNewCall: 'OPEN_NEW_CALL',
      }),
      ...mapActions('call/missed', {
        loadMissedList: 'LOAD_DATA_LIST',
        resetNewMissed: 'RESET_NEW_MISSED',
      }),

      openCall(index) {
        const newNumber = this.missedList[index].from.number;
        this.openNewCall({ newNumber });
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '../../../../../css/agent-workspace/queue-section/queue-task-container';

  .queue-task-container__heading {
    @extend .typo-body-md;
    text-align: center;
    margin: 10px 0 5px;
    color: var(--text-outline-color);
    background: var(--main-color);
  }
</style>
