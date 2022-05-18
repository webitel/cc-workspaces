<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <div class="processing-form__input" v-if="member">
      <h2 class="processing-form__schedule-call-select__title">
        {{ $t('infoSec.postProcessing.nextDistributeAtTitle') }}
      </h2>
      <div class="processing-form__schedule-call-select-wrapper">
        <wt-radio
          v-model="reporting.isScheduleCall"
          :label="$t('infoSec.postProcessing.yes')"
          :value="true"
        ></wt-radio>
        <wt-radio
          v-model="reporting.isScheduleCall"
          :label="$t('infoSec.postProcessing.no')"
          :value="false"
        ></wt-radio>
      </div>
    </div>

    <div
      class="processing-form__input"
      v-if="member"
      v-show="reporting.isScheduleCall"
    >
      <wt-datetimepicker
        v-model="reporting.nextDistributeAt"
        :disabled-dates="{ to: new Date() }"
        :label="$t('infoSec.postProcessing.nextDistributeAt')"
      ></wt-datetimepicker>
    </div>
  </section>
</template>

<script>
export default {
  name: 'reporting-failure-form',
  props: {
    reporting: {
      type: Object,
      required: true,
    },
    member: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
//@import '../../css/post-processing';

.processing-form__schedule-call-select__title {
  @extend %typo-body-1;
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
