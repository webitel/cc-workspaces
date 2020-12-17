<template>
  <div class="processing-communications-container">
    <communication selected="'true'"/>
    <wt-button
      color="secondary"
      wide
      @click="addNewCommunication"
    >
      {{ $t('infoSec.postProcessing.addNewCommunication') }}
    </wt-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Communication from './post-processing-communication.vue';

export default {
  name: 'post-processing-communications-container',
  components: {
    Communication,
  },

  data: () => ({
    selected: '',
  }),

  watch: {
    memberCommunication: {
      handler() {
        this.setCommunication(this.call.memberCommunication);
      },
      immediate: true,
    },
  },

  computed: {
    ...mapState('call', {
      call: (state) => state.callOnWorkspace,
    }),
    ...mapState('reporting', {
      communication: (state) => state.communication,
      newCommunications: (state) => state.newCommunications,
    }),
  },

  methods: {
    ...mapActions('reporting', {
      setCommunication: 'SET_COMMUNICATION',
      addNewCommunication: 'ADD_NEW_COMMUNICATION',
      changeNewCommunication: 'CHANGE_NEW_COMMUNICATION',
      deleteNewCommunication: 'DELETE_NEW_COMMUNICATION',
    }),
  },
};
</script>

<style lang="scss" scoped>
.processing-communications-container {
  margin: 20px 0;

  .wt-button {
    margin-top: 10px;
  }
}
</style>
