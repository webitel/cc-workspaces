<template>
  <section class="post-processing">
    <div v-if="!isAlreadyReported" class="post-processing__wrap">
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
    </div>
    <div v-else class="post-processing__completed">
      <h1 class="post-processing__completed__title">
        {{$t('infoSec.postProcessing.completed')}}</h1>
    </div>
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

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
      }),

      isAlreadyReported() {
        return this.call.reportingAt;
      },

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
