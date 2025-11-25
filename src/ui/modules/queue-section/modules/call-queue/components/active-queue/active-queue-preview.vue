<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="queueName"
    @click="$emit('click', task)"
  >
    <template #icon>
      <img
        :alt="task.state"
        :src="sonarIcon"
      >
    </template>

    <template #title>
      {{ task.displayName }}
    </template>

    <template #subtitle>
      {{ task.displayNumber }}
    </template>

    <template #timer>
      <span v-if="isRinging">
        {{ $t('workspaceSec.callState.ringing') }}
      </span>
      <queue-preview-timer
        v-else
        :task="task"
      />
    </template>

    <template
      v-if="eavesdropStatusIcon"
      #icon-status
    >
      <wt-icon
        :icon="eavesdropStatusIcon"
        size="md"
        color="error"
      ></wt-icon>
    </template>

    <template
      v-if="isRinging"
      #actions
    >
      <wt-button
        color="success"
        icon="call-ringing"
        wide
        @click.prevent="$emit('answer', task)"
        @keydown.enter.prevent="$emit('answer', task)"
      >
        {{ $t('reusable.answer') }}
      </wt-button>
      <wt-button
        color="error"
        icon="call-end"
        wide
        @click.prevent="$emit('hangup', task)"
        @keydown.enter.prevent="$emit('hangup', task)"
      >
        {{ $t('reusable.reject') }}
      </wt-button>
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="queueName"
    @click="$emit('click', task)"
  >

    <template #icon>
      <img
        :alt="task.state"
        :src="sonarIcon"
      >
    </template>

    <template
      v-if="eavesdropStatusIcon"
      #icon-status
    >
      <wt-icon
        :icon="eavesdropStatusIcon"
        size="sm"
        color="error"
      ></wt-icon>
    </template>

    <template #tooltip-title>
      {{ task.displayName }}
    </template>

    <template #tooltip-subtitle>
      {{ task.displayNumber }}
    </template>

    <template
      v-if="!isRinging"
      #subtitle
    >
      <queue-preview-timer :task="task" />
    </template>

    <template
      v-if="isRinging"
      #actions
    >
      <wt-rounded-action
        rounded
        size="sm"
        color="success"
        icon="call-ringing"
        @click.prevent="$emit('answer', task)"
        @keydown.enter.prevent="$emit('answer', task)"
      ></wt-rounded-action>
      <wt-rounded-action
        rounded
        size="sm"
        color="error"
        icon="call-end"
        @click.prevent="$emit('hangup', task)"
        @keydown.enter.prevent="$emit('hangup', task)"
      ></wt-rounded-action>
    </template>
  </task-queue-preview-sm>

  <div
    v-else
  >unknown task size
    <br>
    {{ task }}
  </div>
</template>

<script>
import { CallActions, CallDirection } from 'webitel-sdk';
import { mapGetters } from 'vuex';

import activeSonar from '../../../../../../../app/assets/call-sonars/active-sonar.svg';
import holdSonar from '../../../../../../../app/assets/call-sonars/hold-sonar.svg';
import inboundSonar from '../../../../../../../app/assets/call-sonars/inbound-sonar.svg';
import ringingSonar from '../../../../../../../app/assets/call-sonars/ringing-sonar.svg';
import videoCam from '../../../../../../../app/assets/video/video-cam.svg';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import isIncomingRinging from '../../../../../../../features/modules/call/scripts/isIncomingRinging';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import { getQueueName } from '../../../_shared/scripts/getQueueName'

export default {
  name: 'ActiveQueuePreview',
  mixins: [taskPreviewMixin, sizeMixin],
  computed: {
    ...mapGetters('workspace', {
      isVideoCall: 'IS_VIDEO_CALL_WORKSPACE',
    }),
    isHold() {
      return this.task.isHold;
    },

    queueName() {
      return getQueueName(this.task)
    },

    isRinging() {
      return isIncomingRinging(this.task);
    },

    sonarIcon() {
      if (this.isVideoCall) return videoCam;
      if (this.task.isHold) return holdSonar;
      if (this.task.state === CallActions.Ringing) {
        if (this.task.direction === CallDirection.Inbound) return inboundSonar;
        return ringingSonar;
      }
      return activeSonar;
    },
    eavesdropStatusIcon() {
      if (this.task.eavesdropIsConference) return 'conference';
      if (this.task.eavesdropIsPrompt) return 'prompter';
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
