<template>
  <component
    :is="`task-queue-preview-${size}`"
    :opened="opened"
    :task="task"
    @click="$emit('click', task)"
  >
    <template v-slot:icon>
      <img
        alt=""
        :src="sonarIcon"
      >
    </template>
    <template
      v-slot:additional-status
      v-if="eavesdropStatusIcon"
    >
      <wt-icon
        :icon="eavesdropStatusIcon"
        color="danger"
        :size="size"
      ></wt-icon>
    </template>
    <template v-slot:title>
      {{ task.displayName }}
    </template>
    <template v-slot:body>
      {{ task.displayNumber }}
    </template>
    <template
      v-if="isRinging"
      v-slot:actions
    >
      <component
        :is="size === 'sm' ? 'wt-icon-btn' : 'wt-button'"
        color="success"
        icon="call-ringing"
        :size="size"
        @click.prevent="$emit('answer', task)"
        @keydown.enter.prevent="$emit('answer', task)"
      >
        {{ $t('reusable.answer') }}
      </component>
      <component
        :is="size === 'sm' ? 'wt-icon-btn' : 'wt-button'"
        color="danger"
        icon="call-end"
        :size="size"
        @click.prevent="$emit('hangup', task)"
        @keydown.enter.prevent="$emit('hangup', task)"
      >
        {{ $t('reusable.reject') }}
      </component>
    </template>
  </component>
</template>

<script>
import { CallActions, CallDirection } from 'webitel-sdk';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import isIncomingRinging from '../../../../../../../features/modules/call/scripts/isIncomingRinging';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import activeSonar from '../../../../../../../app/assets/call-sonars/active-sonar.svg';
import holdSonar from '../../../../../../../app/assets/call-sonars/hold-sonar.svg';
import ringingSonar from '../../../../../../../app/assets/call-sonars/ringing-sonar.svg';
import inboundSonar from '../../../../../../../app/assets/call-sonars/inbound-sonar.svg';

export default {
  name: 'active-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
  computed: {
    isHold() {
      return this.task.isHold;
    },

    isRinging() {
      return isIncomingRinging(this.task);
    },

    sonarIcon() {
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
