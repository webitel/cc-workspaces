<template>
  <article
    :class="[
      { 'queue-preview--opened': opened },
    ]"
    class="queue-preview queue-preview-sm"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
  >

    <header class="queue-preview-header">

      <div class="queue-preview-icon">
        <slot name="icon"></slot>
      </div>

      <div class="queue-preview-icon-status">
        <slot name="icon-status"></slot>
      </div>

      <wt-tooltip>
        <template #activator>
          <wt-icon-btn
            color="info"
            icon="rounded-info"
            size="sm"
          ></wt-icon-btn>
        </template>
        <div class="queue-preview-tooltip-content">
          <span
            v-if="$slots['tooltip-title']"
            class="queue-preview-tooltip-title"
          >
            <slot name="tooltip-title"></slot>
          </span>
          <span
            v-if="$slots['tooltip-subtitle']"
            class="queue-preview-tooltip-subtitle"
          >
            <slot name="tooltip-subtitle"></slot>
          </span>
          <div
            v-if="queueName"
            class="queue-preview-tooltip-chips"
          >
            <wt-chip color="secondary">
              {{ queueName }}
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

    <div
      v-if="$slots.title"
      class="queue-preview-title"
    >
      <slot name="title"></slot>
    </div>

    <div
      v-if="$slots.subtitle"
      class="queue-preview-subtitle"
    >
      <slot name="subtitle"></slot>
    </div>

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

export default {
  name: 'TaskQueuePreviewSm',
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

<style lang="scss">
// styles should be unscoped due to tooltip contents styling
@import '../../css/queue-preview';

.queue-preview-sm {
  position: relative;

  .queue-preview-icon {
    flex: 0 0 var(--icon-sm-size);
  }

  .queue-preview-avatar {
    margin: auto;
  }

  .queue-preview-title,
  .queue-preview-subtitle {
    text-align: center;
  }

  .queue-preview-actions {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
  }
}

// tooltip content styling
.queue-preview-tooltip-content {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: var(--spacing-2xs);
}

</style>
