<template>
  <article
    :class="[`agent-pause-causes--${size}`]"
    class="agent-pause-causes"
  >
    <wt-expansion-panel :size="size">
      <template v-slot:title>{{ $t('infoSec.generalInfo.pauses') }}</template>
      <template v-slot:default>
        <ul>
          <li
            v-for="(cause) of representablePauseCause"
            :key="cause.id"
            class="agent-pause-causes-item"
          >
            <span class="agent-pause-causes-item__name">{{ cause.name }}</span>
            <div class="agent-pause-causes-item__wrapper">
              <span>{{ cause.duration }}</span>
              <wt-progress-bar
                :color="cause.progressColor"
                :max="cause.limitMin"
                :value="cause.durationMin"
              ></wt-progress-bar>
              <span>
          {{ cause.limit }}
        </span>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script setup>
import {
  useRepresentableAgentPauseCause,
} from '@webitel/ui-sdk/src/composables/useRepresentableAgentPauseCause/useRepresentableAgentPauseCause';
import { toRef } from 'vue';

const props = defineProps({
  pauseCauses: {
    type: Array,
    required: true,
  },
  size: {
    type: String,
    default: '',
  },
});

const pauseCauses = toRef(props, 'pauseCauses');

const { representablePauseCause } = useRepresentableAgentPauseCause(pauseCauses);
</script>

<style lang="scss" scoped>
.agent-pause-causes {
  .agent-pause-causes-item {
    @extend %typo-body-1;
    display: grid;
    align-items: center;
    padding: var(--spacing-xs);
    grid-template-columns: 2fr 1fr;

    &:not(:last-child) {
      border-bottom: 1px solid var(--divider-border-color);
    }

    &__name {
      word-break: break-all;
      overflow-wrap: break-word;
    }

    &__wrapper {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      gap: var(--spacing-sm);

      :last-child {
        text-align: end;
      }

      .wt-progress-bar {
        width: auto;
        height: fit-content;
        margin: auto 0;
      }
    }
  }

  &--sm {
    .agent-pause-causes-item {
      @extend %typo-body-2;
      grid-template-columns: 1fr;

      &__name {
        margin-bottom: var(--spacing-xs);
      }

      &__wrapper {
        grid-template-columns: 1fr 10fr 1fr;
        gap: var(--spacing-xs);
      }
    }
  }
}
</style>
