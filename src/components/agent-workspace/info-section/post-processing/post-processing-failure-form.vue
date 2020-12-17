<template>
  <form class="processing-form processing-form__failure">
    <div class="processing-form__input">
      <h2 class="processing-form__schedule-call-select__title">
        {{ $t('infoSec.postProcessing.nextDistributeAtTitle') }}
      </h2>
      <div class="processing-form__schedule-call-select-wrapper">
        <wt-radio
          :selected="isScheduleCall"
          :label="$t('infoSec.postProcessing.yes')"
          :value="true"
          @input="setValue({ prop: 'isScheduleCall', value: $event })"
        ></wt-radio>
        <wt-radio
          :selected="isScheduleCall"
          :label="$t('infoSec.postProcessing.no')"
          :value="false"
          @input="setValue({ prop: 'isScheduleCall', value: $event })"
        ></wt-radio>
      </div>
    </div>

    <div class="processing-form__input" v-show="isScheduleCall">
      <wt-datetimepicker
        :value="nextDistributeAt"
        :disabled-dates="disabledDates"
        :label="$t('infoSec.postProcessing.nextDistributeAt')"
        @change="setValue({ prop: 'nextDistributeAt', value: $event })"
      ></wt-datetimepicker>
    </div>
    <member-communications :v="v"/>
    <wt-textarea
      :value="description"
      :label="$t('reusable.description')"
      :placeholder="$t('reusable.description')"
      @input="setValue({ prop: 'description', value: $event })"
    ></wt-textarea>
  </form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MemberCommunications from './member-communications/post-processing-communications-container.vue';

export default {
  name: 'post-processing-failure-form',
  components: {
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
      isScheduleCall: (state) => state.isScheduleCall,
      nextDistributeAt: (state) => state.nextDistributeAt,
      description: (state) => state.description,
    }),
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

.processing-form__schedule-call-select__title {
  @extend %typo-body-lg;
  text-align: center;
  margin-bottom: 10px;
}

.processing-form__schedule-call-select-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  .wt-radio:first-child {
    margin-right: 10px;
  }
}

.processing-form__input.wt-datetimepicker {
  width: 100%;
}
</style>
