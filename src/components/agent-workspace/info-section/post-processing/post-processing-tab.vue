<template>
  <section class="post-processing">
    <h1 class="post-processing__title">{{$t('infoSec.postProcessing.isSuccess')}}</h1>
    <form class="post-processing__success-form">
      <radio-button
        v-model="isSuccess"
        :option="true"
        :label="$t('infoSec.postProcessing.yes')"
      ></radio-button>
      <radio-button
        v-model="isSuccess"
        :option="false"
        :label="$t('infoSec.postProcessing.no')"
      ></radio-button>
    </form>
    <success-form v-if="isSuccess"/>
    <failure-form :v="$v" v-else/>
    <btn
      class="post-processing__submit"
      :class="{disabled: !isCommunicationsValid}"
      @click.native="sendReporting"
    >{{$t('reusable.send')}}
    </btn>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { required } from 'vuelidate/lib/validators';
  import Btn from '../../../utils/btn.vue';
  import RadioButton from '../../../utils/radio-button.vue';
  import SuccessForm from './post-processing-success-form.vue';
  import FailureForm from './post-processing-failure-form.vue';

  export default {
    name: 'post-processing-tab',
    components: {
      Btn,
      RadioButton,
      SuccessForm,
      FailureForm,
    },

    validations: {
      communication: {
        destination: {
          required,
        },
        type: {
          required,
        },
      },
      newCommunications: {
        $each: {
          destination: {
            required,
          },
          type: {
            required,
          },
        },
      },
    },

    watch: {
      call: {
        handler() {
          this.resetForm();
        },
        immediate: true,
      },
    },

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
      }),

      ...mapState('reporting', {
        // for validation purposes
        communication: (state) => state.communication,
        // for validation purposes
        newCommunications: (state) => state.newCommunications,
      }),

      isSuccess: {
        get() {
          return this.$store.state.reporting.isSuccess;
        },
        set(value) {
          this.setValue({ prop: 'isSuccess', value });
        },
      },

      isCommunicationsValid() {
        if (this.isSuccess) return true;
        this.$v.$touch();
        return !(this.$v.$pending || this.$v.$error);
      },
    },

    methods: {
      ...mapActions('reporting', {
        setValue: 'SET_PROPERTY',
        sendReporting: 'SEND_REPORTING',
        resetForm: 'RESET_STATE',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/info-section/post-processing/post-processing';

  .post-processing {
    @extend .cc-scrollbar;
    max-height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
