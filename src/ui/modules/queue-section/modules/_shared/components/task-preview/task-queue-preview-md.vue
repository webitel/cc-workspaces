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
      <article class="queue-preview-chips">
        <queue-name-chip v-if="queueName" :name="queueName" />
      </article>
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
import QueueNameChip from '../../../../../work-section/modules/_shared/components/queue-name-chip/queue-name-chip.vue';

export default {
  name: 'TaskQueuePreview',
  components: { QueueNameChip },
  mixins: [sizeMixin],
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
    display: grid;
    grid-template-columns: 1fr var(--icon-md-size);
    gap: var(--spacing-xs);
  }

  .queue-preview-actions {
    display: flex;
    gap: var(--spacing-xs);
  }
}
</style>
