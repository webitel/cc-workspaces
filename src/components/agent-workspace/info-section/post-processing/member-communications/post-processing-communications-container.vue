<template>
  <div class="processing-communications-container">
    <communication
      v-for="(communication, key) of communicationsList"
      :communication="communication"
      :selected="nextCommunication"
      :key="key"
      :deletable="communicationsList.length > 1"
      @edit="editCommunication(communication)"
      @delete="deleteCommunication(communication)"
      @click.native="selectCommunication(communication)"
    ></communication>
    <wt-button
      color="secondary"
      wide
      @click="addCommunication"
    >
      {{ $t('infoSec.postProcessing.addNewCommunication') }}
    </wt-button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Communication from './post-processing-communication.vue';

export default {
  name: 'post-processing-communications-container',
  components: { Communication },

  data: () => ({
    selected: '',
  }),

  watch: {
    task: {
      handler() {
        this.loadCommunicationsList();
      },
      immediate: true,
    },
  },

  computed: {
    ...mapState('reporting', {
      communicationsList: (state) => state.communicationsList,
      nextCommunication: (state) => state.nextCommunication,
    }),

    ...mapGetters('workspace', {
      task: 'TASK_ON_WORKSPACE',
    }),
  },

  methods: {
    ...mapActions('reporting', {
      selectCommunication: 'SET_NEXT_COMMUNICATION',
      loadCommunicationsList: 'LOAD_COMMUNICATIONS_LIST',
      addCommunication: 'BEGIN_COMMUNICATION_ADDING',
      editCommunication: 'BEGIN_COMMUNICATION_EDIT',
      deleteCommunication: 'DELETE_COMMUNICATION',
    }),
  },
};
</script>

<style lang="scss" scoped>
.processing-communications-container {
  margin: 20px 0;

  .processing-communication {
    margin-bottom: 10px;
  }
}
</style>
