<template>
  <article
    :class="[
      { 'queue-preview--opened': opened },
    ]"
    class="queue-preview queue-preview-md"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
  >
    <header class="queue-preview-header">
      <div class="queue-preview-icon">
        <slot name="icon"></slot>
      </div>

      <div class="queue-preview-header-text-content">
      <span class="queue-preview-title typo-subtitle-2">
        <slot name="title"></slot>
      </span>
        <p class="queue-preview-subtitle typo-body-2">
          <slot name="subtitle"></slot>
        </p>
      </div>

      <div
        v-if="$slots['timer']"
        class="queue-preview-timer"
      >
        <slot name="timer"></slot>
      </div>

      <div
        v-if="$slots['quick-action']"
        class="queue-preview-quick-action"
      >
        <slot name="quick-action"></slot>
      </div>
    </header>

    <section
      class="queue-preview-main-section"
    >
      <queue-name-text v-if="queueName"  :name="queueName" />
      <div
        v-if="$slots['icon-status']"
        class="queue-preview-icon-status"
      >
        <slot name="icon-status"></slot>
      </div>
    </section>

    <div
      v-if="$slots.actions"
      class="queue-preview-actions"
    >
      <slot name="actions"></slot>
    </div>

    <footer
      v-if="$slots.footer"
      class="queue-preview-footer"
    >
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import QueueNameText from "../../../../../work-section/modules/_shared/components/queue-name-text/queue-name-text.vue";

export default {
	name: 'TaskQueuePreview',
	mixins: [
		sizeMixin,
	],
  components: {
    QueueNameText
  },
	props: {
		opened: {
			type: Boolean,
			default: false,
		},
		queueName: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="scss" scoped>
@import '../../css/queue-preview';

.queue-preview-md {
  position: relative;

  .queue-preview-icon {
    flex: 0 0 var(--icon-md-size);
  }

  .queue-preview-header-text-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0; // prevents content overflowing
    gap: var(--spacing-2xs);
  }

  .queue-preview-main-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);

    & > :first-child {
      flex-grow: 1;
      min-width: 0;
    }
  }

  .queue-preview-icon-status {
    flex: 0 0 var(--icon-md-size)
  }

  .queue-preview-actions {
    display: flex;
    gap: var(--spacing-xs);
  }
}
</style>
