<template>
  <article class="agent-queues">
    <ul class="agent-queues__list-wrapper">
      <li
        class="agent-queue"
        v-for="(queue) of queues"
        :key="queue.queue.id"
      >
        <span class="agent-queue__name">{{ queue.queue.name }}</span>
        <span class="agent-queue__waiting">
          <strong>{{ $t('aa Waiting') }}</strong><wt-badge>{{ queue.waitingMembers }}</wt-badge>
        </span>
      </li>
    </ul>
  </article>
</template>

<script>
export default {
  name: 'agent-queues',
  props: {
    queues: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-queue {
  @extend %typo-body-lg;

  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: var(--component-spacing);
  }

  .agent-queue__waiting {
    @extend %typo-strong-sm;
    display: flex;
    align-items: center;

    .wt-badge {
      @extend %typo-strong-sm;
      margin-left: 5px;
    }
  }
}
</style>
