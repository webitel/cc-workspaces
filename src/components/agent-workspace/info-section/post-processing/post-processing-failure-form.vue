<template>
  <form class="processing-form processing-form__failure">
    <multiselect
      class="processing-form__category"
      :value="value"
      :label="'Category'"
      :options="options"
      :api-mode="false"
    ></multiselect>
    <multiselect
      class="processing-form__subcategory"
      :value="value"
      :placeholder="'Subcategory'"
      :options="options"
      :api-mode="false"
    ></multiselect>
    <multiselect
      class="processing-form__category"
      v-model="scheduleCall"
      :label="$t('infoSec.postProcessing.scheduleCall')"
      :options="scheduleCallOptions"
      :api-mode="false"
      :track-by="'value'"
    ></multiselect>
    <div class="processing-form__datetime" v-show="scheduleCall.value">
      <datepicker
        :value="Date.now()"
      ></datepicker>
      <timepicker
        :value="60"
      />
    </div>
    <member-communications/>
    <btn class="processing-form__submit">{{$t('reusable.send')}}</btn>
  </form>
</template>

<script>
  import Btn from '../../../utils/btn.vue';
  import Multiselect from '../../../utils/multiselect.vue';
  import Datepicker from '../../../utils/datepicker.vue';
  import Timepicker from '../../../utils/timepicker.vue';
  import MemberCommunications
    from './member-communications/post-processing-communications-container.vue';

  export default {
    name: 'post-processing-failure-form',
    components: {
      Btn,
      Multiselect,
      Datepicker,
      Timepicker,
      MemberCommunications,
    },
    data: () => ({
      value: [],
      options: [],
      scheduleCallValue: null,
    }),

    computed: {
      scheduleCallOptions() {
        return [
          { name: this.$t('infoSec.postProcessing.yes'), value: true },
          { name: this.$t('infoSec.postProcessing.no'), value: false },
        ];
      },

      scheduleCall: {
        get() {
          return this.scheduleCallValue
            || this.scheduleCallOptions.find((opt) => opt.value === true);
        },
        set(value) {
          console.log('setter', value);
          this.scheduleCallValue = value;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/info-section/post-processing/post-processing';
</style>
