<template>
  <article
    :class="[
      { 'queue-preview--opened': opened },
    ]"
    class="queue-preview queue-preview--sm"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
  >

    <header class="queue-preview-header">
      <div class="queue-preview-header__icon">
        <slot name="icon"></slot>
      </div>
      <div class="queue-preview-additional-status">
        <slot name="additional-status"></slot>
      </div>
      <wt-tooltip>
        <template v-slot:activator>
          <wt-icon-btn
            color="secondary"
            icon="rounded-info"
            size="sm"
          ></wt-icon-btn>
        </template>
        <div class="queue-preview-info">
          <span class="queue-preview-header__title">
            <slot name="title"></slot>
          </span>
          <p class="queue-preview-header__subtitle">
            <slot name="body"></slot>
          </p>
          <div
            v-if="displayQueueName"
            class="queue-preview-chips"
          >
            <wt-chip color="secondary">
              {{ displayQueueName }}
            </wt-chip>
          </div>
        </div>
      </wt-tooltip>
    </header>

    <section class="queue-preview-avatar">
      <slot name="avatar">
        <wt-avatar
          size="sm"
        ></wt-avatar>
      </slot>
    </section>

    <slot name="timer">
      <queue-preview-timer
        :task="task"
      ></queue-preview-timer>
    </slot>

    <footer
      v-if="$slots.footer || $slots.actions"
      class="queue-preview-footer"
    >
      <slot name="footer">
        <div class="queue-preview-actions">
          <slot name="actions"></slot>
        </div>
      </slot>
    </footer>
  </article>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import displayInfo from '../../../../../../mixins/displayInfoMixin';
import QueuePreviewTimer from '../queue-preview-timer.vue';

export default {
  name: 'task-queue-preview',
  components: { QueuePreviewTimer },
  mixins: [displayInfo, sizeMixin],
  props: {
    task: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
// styles should be unscoped due to tooltip contents styling
@import '../../css/queue-preview';

.queue-preview--sm {
  .queue-preview-header__icon {
    width: 16px;
    height: 16px;
  }

  .queue-preview-avatar {
    margin: auto;
  }

  .queue-preview-timer {
    margin: auto;
  }

  .queue-preview-actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

// tooltip content styling
.queue-preview-info {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: var(--spacing-2xs);

  .queue-preview-header__title {
    @extend %typo-subtitle-2;
  }

  .queue-preview-header__subtitle {
    @extend %typo-body-2;
  }
}

</style>
