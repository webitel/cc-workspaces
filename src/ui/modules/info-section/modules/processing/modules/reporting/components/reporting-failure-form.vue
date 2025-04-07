<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <div v-if="member" class="processing-form__input">
      <h2 class="processing-form__schedule-call-select__title">
        {{ $t('infoSec.processing.reporting.nextDistributeAtTitle') }}
      </h2>
      <div class="processing-form__schedule-call-select-wrapper">
        <wt-radio
          v-model="reporting.isScheduleCall"
          :label="$t('infoSec.processing.reporting.yes')"
          :value="true"
        ></wt-radio>
        <wt-radio
          v-model="reporting.isScheduleCall"
          :label="$t('infoSec.processing.reporting.no')"
          :value="false"
        ></wt-radio>
      </div>
    </div>

    <div
      v-if="member"
      v-show="reporting.isScheduleCall"
      class="processing-form__input"
    >
      <wt-datepicker
        v-model="reporting.nextDistributeAt"
        :disabled-dates="(d) => d.getTime() < new Date().setDate(new Date().getDate() - 1)"
        :label="$t('infoSec.processing.reporting.nextDistributeAt')"
        mode="datetime"
      ></wt-datepicker>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ReportingFailureForm',
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
  margin-bottom: var(--spacing-xs);
}

.processing-form__schedule-call-select-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  .wt-radio:first-child {
    margin-right: var(--spacing-xs);
  }
}

.processing-form__input.wt-datetimepicker {
  width: 100%;
}
</style>
