<template>
  <section class="chat-preview__queue">
    <div class="chat-preview__badges-box">
      <wt-badge v-if="displayQueueName" color="secondary">
        {{displayQueueName}}
      </wt-badge>
    </div>
    <div class="chat-preview__icon">
      <wt-icon-btn icon="close"></wt-icon-btn>
    </div>
  </section>
</template>

<script>
import displayInfo from '../../../../../../mixins/displayInfoMixin';

export default {
  name: 'chat-queue-name',
  mixins: [displayInfo],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-preview__queue {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--component-padding);
  background-color: var(--secondary-color-50);
  border-radius: var(--border-radius)
}

.chat-preview__badges-box {
  max-width: 400px;
}

</style>
