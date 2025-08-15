<template>
  <processing-wrapper
    v-if="taskReporting"
    class="reporting"
    :task="task"
  >
    <template #title>
      {{ $t('infoSec.processing.reporting.isSuccess') }}
    </template>
    <template #form>
      <div class="reporting__status-wrapper">
        <wt-radio
          v-model="taskReporting.success"
          :label="$t('infoSec.processing.reporting.yes')"
          :value="true"
        ></wt-radio>

        <wt-radio
          v-model="taskReporting.success"
          :label="$t('infoSec.processing.reporting.no')"
          :value="false"
        ></wt-radio>
      </div>
      <form class="reportingg-form">
        <failure-form
          v-show="!taskReporting.success"
          class="reporting-form"
          :member="task.isMember"
          :reporting="taskReporting"
        ></failure-form>
        <wt-textarea
          v-model="taskReporting.description"
          :label="$t('reusable.description')"
          :placeholder="$t('reusable.description')"
        ></wt-textarea>
      </form>
    </template>
    <template #actions>
      <wt-button
        :color="reportButtonColor"
        class="post-processing__submit-btn"
        @click="sendReporting"
      >{{ reportButtonText }}
      </wt-button>
    </template>
  </processing-wrapper>
</template>

<script setup lang="ts">
import { computed, watch, defineProps } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import FailureForm from './reporting-failure-form.vue';
import ProcessingWrapper from '../../../components/processing-wrapper.vue';

export interface IReportingPayload {
  success: boolean;
  description: string;
  nextDistributeAt?: number;
}

export interface IReportingForm {
  success: boolean;
  description: string;
  nextDistributeAt: number;
  isScheduleCall: boolean;
  generateReporting: () => IReportingPayload;
}

interface ITask {
  postProcessData: IReportingForm;
  attempt: {
    reportedAt?: number | string | null;
  };
  reporting: (payload: IReportingPayload) => void;
}

interface IReportingProps {
  task: ITask;
}

const store = useStore()
const { t } = useI18n()

const props = defineProps<IReportingProps>()

const taskReporting = computed(() => props.task.postProcessData)
const isTaskReporting = computed(() => !!taskReporting.value)
const reportingSent = computed(() => props.task.attempt?.reportedAt)

const reportButtonColor = computed(() =>
  reportingSent.value ? 'secondary' : 'primary'
)

const reportButtonText = computed(() =>
  reportingSent.value ? t('reusable.edit') : t('reusable.send')
)

const initReportingForm = () =>
  store.dispatch('ui/infoSec/processing/reporting/INIT_REPORTING_FORM')

const sendReporting = () => {
  const reporting = taskReporting.value.generateReporting()
  props.task.reporting(reporting)
}


watch(isTaskReporting, () => {
  initReportingForm()
}, { immediate: true })

</script>

<style lang="scss" scoped>
.reporting__status-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);

  .wt-button {
    width: 120px;
  }
}

.reporting-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
