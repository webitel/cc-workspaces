<template>
  <div class="processing-communications-container">
    <communication
      v-if="communication"
      :value="communication"
      :selected="selected"
      :v="existingCommunicationValidation"
      exists
      @select="selected = $event"
      @change="changeCommunication"
    ></communication>
    <communication
      v-for="(communication, key) of newCommunications"
      :value="communication"
      :selected="selected"
      :key="key"
      :v="v.newCommunications.$each[key]"
      @select="selected = $event"
      @change="changeNewCommunication({value: $event, index: key})"
      @delete="deleteNewCommunication(key)"
    ></communication>
    <button
      class="processing-communications-container__add-new"
      @click.prevent="addNewCommunication"
    >
      <icon>
        <svg class="icon icon-plus-md md">
          <use xlink:href="#icon-plus-md"></use>
        </svg>
      </icon>
      <span class="processing-communications-container__add-new__text">
        {{$t('infoSec.postProcessing.addNewCommunication')}}</span>
    </button>
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
    props: {
      v: {
        type: Object,
      },
    },

    data: () => ({
      selected: '',
    }),

    computed: {
      ...mapState('reporting', {
        changedCommunication: (state) => state.communication,
        newCommunications: (state) => state.newCommunications,
      }),
      communication() {
        if (this.changedCommunication) {
          return this.changedCommunication;
        }
        return this.$store.state.call.callOnWorkspace.memberCommunication;
      },
      existingCommunicationValidation() {
        return this.changedCommunication ? this.v : {};
      },
    },

    methods: {
      ...mapActions('reporting', {
        changeCommunication: 'CHANGE_COMMUNICATION',
        addNewCommunication: 'ADD_NEW_COMMUNICATION',
        changeNewCommunication: 'CHANGE_NEW_COMMUNICATION',
        deleteNewCommunication: 'DELETE_NEW_COMMUNICATION',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .processing-communications-container {
    margin: calcVH(40px) 0;

    &__add-new {
      display: flex;
      align-items: center;
      margin-top: calcVH(30px);

      &__text {
        @extend .typo-body-sm;
        margin-left: calcVH(30px);
      }
    }
  }
</style>
