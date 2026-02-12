<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="queueName"
    @click="$emit('click', task)"
  >
    <template #icon>
      <wt-icon
        v-if="isVideoCall"
        icon="video-cam"
        color="success"
      />
      <img
        v-else
        :alt="task.state"
        :src="sonarIcon"
      />
    </template>

    <template #title>
      {{ task.displayName }}
    </template>

    <template #subtitle>
      {{ displayNumber }}
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
      />
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
      {{ displayNumber }}
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

  <div v-else>
    {{ $t('reusable.unknownTaskSize') }}
    <br />
    {{ task }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import isIncomingRinging from '../../../../../../../features/modules/call/scripts/isIncomingRinging';
import { useCallState } from '../../../../../../composables/useCallState';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import { getQueueName } from '../../../_shared/scripts/getQueueName';

export default {
	name: 'ActiveQueuePreview',
	mixins: [
		taskPreviewMixin,
		sizeMixin,
	],
	setup() {
		const { sonarIcon } = useCallState();

		return {
			sonarIcon,
		};
	},
	computed: {
		...mapGetters('features/call', {
			normalizePhoneNumber: 'NORMALIZE_PHONE_NUMBER',
		}),
		...mapGetters('features/call/videoCall', {
			isVideoCall: 'IS_VIDEO_CALL',
		}),
		isHold() {
			return this.task.isHold;
		},

		queueName() {
			return getQueueName(this.task);
		},

		isRinging() {
			return isIncomingRinging(this.task);
		},

		displayNumber() {
			//https://webitel.atlassian.net/browse/WTEL-8215
			return this.normalizePhoneNumber(this.task.displayNumber);
		},

		eavesdropStatusIcon() {
			if (this.task.eavesdropIsConference) return 'conference';
			if (this.task.eavesdropIsPrompt) return 'prompter';
			return null;
		},
	},
};
</script>
