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
      <failure-form v-else/>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import RadioButton from '../../../utils/radio-button.vue';
  import SuccessForm from './post-processing-success-form.vue';
  import FailureForm from './post-processing-failure-form.vue';

  export default {
    name: 'post-processing-tab',
    components: {
      RadioButton,
      SuccessForm,
      FailureForm,
    },

    watch: {
      call() {
        this.resetForm();
      },
    },

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
      }),

      isSuccess: {
        get() {
          return this.$store.state.reporting.isSuccess;
        },
        set(value) {
          this.setValue({ prop: 'isSuccess', value });
        },
      },
    },

    methods: {
      ...mapActions('reporting', {
        setValue: 'SET_PROPERTY',
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
