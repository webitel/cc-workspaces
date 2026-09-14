<template>
  <div class="break-timer">
    <div class="break-timer__main-wrapper">
      <div class="break-timer__icon-wrapper">
        <wt-icon
          :icon="agentStatus === AgentStatus.Pause ? 'pause' : 'breakout'"
          icon-prefix="ws"
          size="3xl"
        ></wt-icon>
      </div>
      <div class="break-timer__timer-wrap">
        <div class="break-timer__timer">
          <span
            v-for="(digit, key) of duration.split('')"
            :key="key"
            class="break-timer__timer-digit typo-timer-digits"
          >
            {{ digit }}
          </span>
        </div>
        <div class="break-timer__pause-cause typo-subtitle-2">
          {{ breakInfo }}
        </div>
      </div>
    </div>
    <div
      v-if="statusComment"
      class="break-timer__status-comment wt-scrollbar"
    >
      {{ statusComment }}
    </div>
  </div>
</template>

<script setup>
import { AgentStatus } from 'webitel-sdk';

const props = defineProps({
	agentStatus: {
		type: String,
		required: true,
	},
	duration: {
		type: String,
		required: true,
	},
	breakInfo: {
		type: String,
		default: '',
	},
	statusComment: {
		type: String,
		default: '',
	},
});
</script>

<style lang="scss" scoped>
.typo-timer-digits {
  font-family: 'Montserrat', monospace;
  font-size: 64px;
  line-height: 78px;
  font-weight: 700;
}

.break-timer__main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: var(--warning-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
}

.break-timer__icon-wrapper {
  padding: var(--spacing-sm);
  line-height: 0;
  background: var(--content-wrapper-color);
  border-radius: var(--border-radius);
}

.break-timer__timer {
  width: fit-content;
  margin: auto;
}

.break-timer__timer-digit {
  text-align: center;
  display: inline-block;
  width: 40px;
  color: var(--primary-on-color);

  /*semicolons*/
  &:nth-child(3), &:nth-child(6) {
    width: 24px;
  }
}

.break-timer__pause-cause {
  text-align: center;
  color: var(--primary-on-color);
}

.break-timer__status-comment {
  margin-top: var(--spacing-sm);
  max-height: 80px;
  overflow: auto;
  word-break: break-word;
}
</style>
