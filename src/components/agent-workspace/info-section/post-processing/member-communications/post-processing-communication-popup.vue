<template>
  <post-processing-wrapper class="processing-communication-popup" color="failure">
    <template slot="title">{{ title }}</template>
    <template slot="main">
      <wt-input
        v-model="communication.destination"
        :v="$v.communication.destination"
        :label="$t('infoSec.postProcessing.communicationDestination')"
        required
      ></wt-input>
      <wt-select
        v-model="communication.type"
        :v="$v.communication.type"
        :label="$t('infoSec.postProcessing.communicationType')"
        :internal-search="false"
        :search="getCommunications"
        :clearable="false"
        required
      ></wt-select>
      <wt-input
        v-model="communication.priority"
        :label="$t('infoSec.postProcessing.communicationPriority')"
      ></wt-input>
    </template>
    <template slot="actions">
      <wt-button
        class="processing-communication-popup__action"
        :disabled="$v.$error"
        @click="save"
      >{{ $t('reusable.save') }}
      </wt-button>
      <wt-button
        class="processing-communication-popup__action"
        color="secondary"
        @click="cancel"
      >{{ $t('reusable.cancel') }}
      </wt-button>
    </template>
  </post-processing-wrapper>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import deepCopy from 'deep-copy';
import PostProcessingWrapper from '../_internals/post-processing-wrapper.vue';
import APIRepository from '../../../../../api/APIRepository';

const communicationsAPI = APIRepository.communications;

const defaultCommunication = () => ({
  destination: '',
  type: '',
  priority: 0,
});

export default {
  name: 'post-processing-communication-popup',
  components: { PostProcessingWrapper },
  data: () => ({
    communication: {},
  }),
  validations: {
    communication: {
      destination: { required },
      type: { required },
    },
  },
  watch: {
    communication: {
      handler() {
        this.$v.$touch();
      },
      deep: true,
      immediate: true,
    },
    isCommunicationPopup: {
      handler() {
        this.refreshData();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState('reporting', {
      isNewCommunication: (state) => state.isNewCommunication,
      editedCommunication: (state) => state.editedCommunication,
    }),

    ...mapGetters('reporting', {
      isCommunicationPopup: 'IS_COMMUNICATION_POPUP',
    }),
    title() {
      return this.isNewCommunication
        ? this.$t('infoSec.postProcessing.createCommunicationTitle')
        : this.$t('infoSec.postProcessing.editCommunicationTitle');
    },
  },
  methods: {
    ...mapActions('reporting', {
      addCommunication: 'ADD_COMMUNICATION',
      editCommunication: 'EDIT_COMMUNICATION',
      cancel: 'CLOSE_COMMUNICATION_ACTIONS',
    }),
    save() {
      const { communication } = this;
      if (this.isNewCommunication) {
        this.addCommunication(communication);
      } else {
        this.editCommunication(communication);
      }
    },
    refreshData() {
      this.communication = this.isNewCommunication
      ? defaultCommunication() : deepCopy(this.editedCommunication);
    },
    async getCommunications(params) {
      const response = await communicationsAPI.getCommunicationTypes(params);
      return response.items || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.processing-communication-popup__action {
  &:first-child {
    margin-right: 10px;
  }
}
</style>
