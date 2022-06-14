<template>
  <article
    :class="{ 'queue-preview--opened': opened }"
    class="queue-preview"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
  >
    <header class="queue-preview-header">
      <slot name="icon"></slot>
      <span class="queue-preview-header__name">
        <slot name="title">
          {{ title || displayName | truncate(18) }}
        </slot>
      </span>
      <queue-preview-timer :task="task" bold />
    </header>
    <section class="queue-preview-body">
      <slot name="body"></slot>
    </section>
    <section
      v-if="displayQueueName"
      class="queue-preview-chips"
    >
      <wt-chip color="secondary">
        {{ displayQueueName }}
      </wt-chip>
    </section>
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
import displayInfo from '../../../../mixins/displayInfoMixin';
import QueuePreviewTimer from './queue-preview-timer.vue';

export default {
  name: 'chat-queue-preview',
  components: { QueuePreviewTimer },
  mixins: [displayInfo],
  props: {
    task: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../css/queue-task-preview';
</style>
