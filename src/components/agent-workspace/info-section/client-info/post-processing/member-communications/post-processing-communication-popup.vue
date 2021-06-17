<template>
  <post-processing-wrapper class="processing-communication-popup" color="failure">
    <template slot="title">{{ title }}</template>
    <template slot="main">
      <wt-input
        v-model="draft.destination"
        :v="$v.draft.destination"
        :label="$t('infoSec.postProcessing.communicationDestination')"
        required
      ></wt-input>
      <wt-select
        v-model="draft.type"
        :v="$v.draft.type"
        :label="$t('infoSec.postProcessing.communicationType')"
        :internal-search="false"
        :search="getCommunications"
        :clearable="false"
        required
      ></wt-select>
      <wt-input
        v-model="draft.priority"
        type="number"
        :label="$t('infoSec.postProcessing.communicationPriority')"
      ></wt-input>
      <post-processing-timer-wrapper/>
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
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import deepCopy from 'deep-copy';
import PostProcessingTimerWrapper from '../_internals/post-processing-timer-wrapper.vue';
import PostProcessingWrapper from '../_internals/post-processing-wrapper.vue';
import APIRepository from '../../../../../../api/APIRepository';

const communicationsAPI = APIRepository.communications;

const defaultCommunication = () => ({
  destination: '',
  type: '',
  priority: 0,
});

export default {
  name: 'post-processing-communication-popup',
  components: { PostProcessingWrapper, PostProcessingTimerWrapper },
  data: () => ({
    draft: {},
  }),
  props: {
    communication: {
      type: Object,
      description: 'Edited communication',
    },
  },
  validations: {
    draft: {
      destination: { required },
      type: { required },
    },
  },
  watch: {
    draft: {
      handler() {
        this.$v.$touch();
      },
      deep: true,
      immediate: true,
    },
    isCommunicationPopup: {
      handler() {
        this.setDraft();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters('reporting', {
      isCommunicationPopup: 'IS_COMMUNICATION_POPUP', // used for setDraft() watcher
    }),
    isNewCommunication() {
      return !this.communication;
    },
    title() {
      return this.isNewCommunication
        ? this.$t('infoSec.postProcessing.createCommunicationTitle')
        : this.$t('infoSec.postProcessing.editCommunicationTitle');
    },
  },
  methods: {
    save() {
      if (this.isNewCommunication) {
        this.$emit('submit:add', this.draft);
      } else {
        this.$emit('submit:edit', this.draft);
      }
      this.close();
    },
    setDraft() {
      this.draft = this.isNewCommunication
        ? defaultCommunication() : deepCopy(this.communication);
    },
    cancel() {
      this.close();
    },
    close() {
      this.$emit('close');
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

.post-processing-timer {
  margin: var(--component-spacing) auto;
}
</style>
