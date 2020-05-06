<template>
  <form class="processing-form processing-form__failure">
    <multiselect
      class="processing-form__category"
      :value="[]"
      :label="'Category'"
      :options="[]"
      :api-mode="false"
    ></multiselect>
    <multiselect
      class="processing-form__subcategory"
      :value="[]"
      :placeholder="'Subcategory'"
      :options="[]"
      :api-mode="false"
    ></multiselect>

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
      ></datepicker>
      <timepicker
        v-model="nextDistributeAt"
      />
    </div>
    <member-communications/>
    <cc-textarea
      v-model="description"
      :placeholder="$t('reusable.description')"
    ></cc-textarea>
    <btn
      class="processing-form__submit"
      @click.native="sendReporting"
    >{{$t('reusable.send')}}
    </btn>
  </form>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import Btn from '../../../utils/btn.vue';
  import CcTextarea from '../../../utils/textarea.vue';
  import Multiselect from '../../../utils/multiselect.vue';
  import Datepicker from '../../../utils/datepicker.vue';
  import Timepicker from '../../../utils/timepicker.vue';
  import MemberCommunications
    from './member-communications/post-processing-communications-container.vue';

  export default {
    name: 'post-processing-failure-form',
    components: {
      Btn,
      CcTextarea,
      Multiselect,
      Datepicker,
      Timepicker,
      MemberCommunications,
    },

    computed: {
      ...mapState('reporting', {
        isScheduleCallValue: (state) => state.isScheduleCall,
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
          return this.$store.state.reporting.nextDistributeAt;
        },
        set(value) {
          this.setValue({ prop: 'nextDistributeAt', value });
        },
      },

      description: {
        get() {
          return this.$store.state.reporting.description;
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
        sendReporting: 'SEND_REPORTING',
        setValue: 'SET_PROPERTY',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/info-section/post-processing/post-processing';
</style>
