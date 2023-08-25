<template>
  <article
    :class="`queue-preview--${size}`"
    class="queue-preview queue-preview--offline-queue"
    tabindex="0"
    @click="$emit('click', task)"
    @keydown.enter="$emit('click', task)"
  >

    <wt-tooltip v-if="size === 'sm'">
      <template v-slot:activator>
        <wt-icon-btn
          color="secondary"
          icon="rounded-info"
          size="sm"
        ></wt-icon-btn>
      </template>
      <span
        class="queue-preview--offline-queue__name"
      >{{ displayName }}
      </span>
      <div
        v-if="displayQueueName"
      >
        <wt-chip color="secondary">
          {{ displayQueueName }}
        </wt-chip>
      </div>
    </wt-tooltip>

    <wt-icon
      color="hold"
      icon="call"
      size="md"
    ></wt-icon>

    <section class="queue-preview--offline-queue__title">
      {{ displayName }}
    </section>
    <div class="queue-preview--offline-queue__callback-container">
      <!-- If there's only one communication, show a single call button -->
      <template v-if="task.communications.length === 1">
        <wt-rounded-action
          :size="size"
          color="success"
          icon="call--filled"
          rounded
          @click.stop="makeCall(task.communications[0].destination)"
        ></wt-rounded-action>
      </template>
      <!-- If there are multiple communications, show a context menu with call options -->
      <template v-else>
        <wt-context-menu
          :options="options"
          max-width="300px"
        >
          <template v-slot:activator>
            <wt-rounded-action
              :size="size"
              color="success"
              icon="call--filled"
              rounded
            ></wt-rounded-action>
          </template>
          <template v-slot:option="{ text }">
            <!-- Clicking an option makes a call -->
            <div
              class="queue-preview--offline-queue__callback-button"
              @click="makeCall(text)"
            ><span>{{ text }}</span></div>
          </template>
        </wt-context-menu>
      </template>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'offline-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],

  computed: {
    ...mapState({
      client: (state) => state.client,
      config: (state) => state.config,
    }),
    displayName() {
      return this.task.name;
    },
    displayQueueName() {
      return this.task.queue?.name;
    },
    options() {
      return this.task.communications.map((el) => ({
        text: el.destination,
      }));
    },
  },
  methods: {
    async makeCall(destination) {
      const CALL_PARAMS = { disableStun: this.config.CLI.stun };
      const params = {
        ...CALL_PARAMS,
        video: false,
      };
      const client = await this.client.getCliInstance();
      await client.call({
        destination,
        params,
      });
    },
  },
};
</script>

// removed "scoped" to style a tooltip content
<style lang="scss">
.queue-preview {
  &.queue-preview--offline-queue {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: center;
    gap: var(--spacing-2xs);
  }

  .queue-preview--offline-queue__title {
    overflow: hidden;
    @extend %typo-subtitle-1;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .queue-preview--offline-queue__callback-container {
    display: flex;
    justify-content: center;

    .wt-context-menu__option {
      padding: 0;
    }

    .queue-preview--offline-queue__callback-button {
      padding: var(--spacing-xs);
    }
  }

  .wt-tooltip {
    align-self: flex-end;
  }

  &--md.queue-preview--offline-queue {
    flex-direction: row;
  }

  &--sm {
    .queue-preview--offline-queue__title {
      @extend %typo-body-2;
    }
  }
}

.queue-preview--offline-queue__name {
  @extend %typo-subtitle-1;
}
</style>
