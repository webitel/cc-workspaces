<template>
  <form class="processing-form processing-form__failure">
<!--    <multiselect-->
<!--      class="processing-form__category"-->
<!--      :value="[]"-->
<!--      :label="$t('infoSec.postProcessing.category')"-->
<!--      :options="[]"-->
<!--      :api-mode="false"-->
<!--    ></multiselect>-->
<!--    <multiselect-->
<!--      class="processing-form__subcategory"-->
<!--      :value="[]"-->
<!--      :label="$t('infoSec.postProcessing.subcategory')"-->
<!--      :options="[]"-->
<!--      :api-mode="false"-->
<!--    ></multiselect>-->

    <multiselect
      class="processing-form__category"
      v-model="isScheduleCall"
      :label="$t('infoSec.postProcessing.scheduleCall')"
      :options="isisScheduleCallOptions"
      :api-mode="false"
      :track-by="'value'"
    ></multiselect>

    <div class="processing-form__datetime" v-show="isScheduleCallValue">
      <datepicker
        v-model="nextDistributeAt"
        :disabled-dates="disabledDates"
      ></datepicker>
      <timepicker
        v-model="nextDistributeAt"
        :type="'text'"
        min-select
      />
    </div>
    <member-communications :v="v"/>
    <cc-textarea
      v-model="description"
      :placeholder="$t('reusable.description')"
    ></cc-textarea>
  </form>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import CcTextarea from '../../../utils/textarea.vue';
  import Multiselect from '../../../utils/multiselect.vue';
  import Datepicker from '../../../utils/datepicker.vue';
  import Timepicker from '../../../utils/timepicker.vue';
  import MemberCommunications
    from './member-communications/post-processing-communications-container.vue';

  export default {
    name: 'post-processing-failure-form',
    components: {
      CcTextarea,
      Multiselect,
      Datepicker,
      Timepicker,
      MemberCommunications,
    },
    props: {
      v: {
        type: Object,
      },
    },

    data: () => ({
      disabledDates: {
        to: new Date(),
      },
    }),

    computed: {
      ...mapState('reporting', {
        isScheduleCallValue: (state) => state.isScheduleCall,
        nextDistributeAtValue: (state) => state.nextDistributeAt,
        descriptionValue: (state) => state.description,
      }),

      isScheduleCall: {
        get() {
          // complicated getter for value for $t() name property in object
          return this.isisScheduleCallOptions
            .find((opt) => opt.value === this.isScheduleCallValue);
        },
        set(option) {
          this.setValue({ prop: 'isScheduleCall', value: option.value });
        },
      },

      nextDistributeAt: {
        get() {
          const nextDistributeAt = new Date(this.nextDistributeAtValue);
          const min = nextDistributeAt.getMinutes();
          if (min % 15) {
            nextDistributeAt.setHours(nextDistributeAt.getHours() + 1);
            nextDistributeAt.setMinutes(0, 0, 0);
          }
          return nextDistributeAt.getTime();
        },
        set(value) {
          this.setValue({ prop: 'nextDistributeAt', value });
        },
      },

      description: {
        get() {
          return this.descriptionValue;
        },
        set(value) {
          this.setValue({ prop: 'description', value });
        },
      },

      isisScheduleCallOptions() {
        return [
          { name: this.$t('infoSec.postProcessing.yes'), value: true },
          { name: this.$t('infoSec.postProcessing.no'), value: false },
        ];
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
</style>
