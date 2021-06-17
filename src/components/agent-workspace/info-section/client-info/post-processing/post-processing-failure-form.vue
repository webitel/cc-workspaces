<template>
  <form class="processing-form processing-form__failure">
    <div class="processing-form__input" v-if="isMember">
      <h2 class="processing-form__schedule-call-select__title">
        {{ $t('infoSec.postProcessing.nextDistributeAtTitle') }}
      </h2>
      <div class="processing-form__schedule-call-select-wrapper">
        <wt-radio
          v-model="taskPostProcessing.isScheduleCall"
          :label="$t('infoSec.postProcessing.yes')"
          :value="true"
        ></wt-radio>
        <wt-radio
          v-model="taskPostProcessing.isScheduleCall"
          :label="$t('infoSec.postProcessing.no')"
          :value="false"
        ></wt-radio>
      </div>
    </div>

    <div class="processing-form__input" v-if="isMember" v-show="taskPostProcessing.isScheduleCall">
      <wt-datetimepicker
        v-model="taskPostProcessing.nextDistributeAt"
        :disabled-dates="{ to: new Date() }"
        :label="$t('infoSec.postProcessing.nextDistributeAt')"
      ></wt-datetimepicker>
    </div>
    <member-communications v-if="isMember" />
    <wt-textarea
      v-model="taskPostProcessing.description"
      :label="$t('reusable.description')"
      :placeholder="$t('reusable.description')"
    ></wt-textarea>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import MemberCommunications from './member-communications/post-processing-communications-container.vue';

export default {
  name: 'post-processing-failure-form',
  components: { MemberCommunications },
  computed: {
    ...mapGetters('reporting', {
      taskPostProcessing: 'TASK_POST_PROCESSING',
      isMember: 'IS_MEMBER',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../../css/agent-workspace/info-section/post-processing/post-processing';

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
