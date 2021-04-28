<template>
  <article class="agent-pause-causes">
    <ul class="agent-pause-causes__list-wrapper">
      <li
        class="agent-pause-cause"
        v-for="(cause) of pauseCauses"
        :key="cause.id"
      >
        <span class="agent-pause-cause__name">{{ cause.name }}</span>
        <span class="agent-pause-cause__duration">{{ duration(cause) }}</span>
        <wt-progress-bar
          :max="cause.limitMin"
          :value="cause.durationMin"
          :color="pauseCauseProgressColor(cause)"
        ></wt-progress-bar>
        <span class="agent-pause-cause__duration">
          {{ prettifyPauseCauseDuration(cause.limitMin) }}
        </span>
      </li>
    </ul>
  </article>
</template>

<script>
import agentPauseCauseRepresentationMixin from '@webitel/cc-ui-sdk/src/mixins/agentPauseCauseRepresentation/agentPauseCauseRepresentationMixin';

export default {
  name: 'agent-pause-causes',
  mixins: [agentPauseCauseRepresentationMixin],
  props: {
    pauseCauses: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-pause-cause {
  @extend %typo-body-lg;

  display: grid;
  grid-template-columns: 1fr 50px minmax(100px, 1fr) 45px;
  grid-gap: var(--component-spacing);
  align-items: center;

  &:not(:last-child) {
    margin-bottom: var(--component-spacing);
  }

  &__name {
    overflow-wrap: break-word;
    word-break: break-all;
  }
}
</style>
