<template>
  <div class="processing-communications-container">
    <communication
      v-for="(communication, key) of taskPostProcessing.communications"
      :communication="communication"
      :selected="taskPostProcessing.nextCommunication"
      :key="key"
      :deletable="taskPostProcessing.communications.length > 1"
      @edit="taskPostProcessing.startCommunicationEditing(communication)"
      @delete="taskPostProcessing.deleteCommunication(communication)"
      @click.native="taskPostProcessing.selectNextCommunication(communication)"
    ></communication>
    <wt-button
      color="secondary"
      wide
      @click="taskPostProcessing.startCommunicationAdding()"
    >
      {{ $t('infoSec.postProcessing.addNewCommunication') }}
    </wt-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Communication from './post-processing-communication.vue';

export default {
  name: 'post-processing-communications-container',
  components: { Communication },

  computed: {
    ...mapGetters('features/reporting', {
      taskPostProcessing: 'TASK_POST_PROCESSING',
      isCommunicationPopup: 'IS_COMMUNICATION_POPUP',
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
