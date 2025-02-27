<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    class="missed-queue-preview"
    @click="$emit('click')"
  >
    <template v-slot:icon>
      <div class="missed-preview-icon-wrapper">
        <wt-icon
          class="missed-queue-preview-icon"
          color="error"
          icon="call-missed"
        ></wt-icon>
        <wt-icon-btn
          class="missed-queue-preview-hide-action"
          icon="close"
          @click.prevent="$emit('hide')"
        ></wt-icon-btn>
      </div>
    </template>

    <template v-slot:title>
      {{ displayName }}
    </template>

    <template v-slot:subtitle>
      {{ displayNumber }}
    </template>

    <template v-slot:timer>
      {{ displayTime }}
    </template>

    <template v-slot:quick-action>
      <wt-rounded-action
        color="success"
        icon="call--filled"
        rounded
        size="md"
        @click.prevent="$emit('call')"
      ></wt-rounded-action>
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    class="missed-queue-preview"
  >
    <template v-slot:icon>
      <div class="missed-preview-icon-wrapper">
        <wt-icon
          class="missed-queue-preview-icon"
          color="error"
          size="sm"
          icon="call-missed"
        ></wt-icon>
        <wt-icon-btn
          class="missed-queue-preview-hide-action"
          icon="close"
          size="sm"
          @click.prevent="$emit('hide')"
        ></wt-icon-btn>
      </div>
    </template>

    <template v-slot:tooltip-title>
      {{ displayName }}
    </template>

    <template v-slot:tooltip-subtitle>
      {{ displayNumber }}
    </template>

    <template v-slot:title>
      {{ displayName }}
    </template>

    <template v-slot:subtitle>
      {{ displayTime }}
    </template>

    <template v-slot:actions>
      <wt-rounded-action
        color="success"
        icon="call--filled"
        rounded
        size="sm"
        @click.prevent="$emit('call')"
      ></wt-rounded-action>
    </template>
  </task-queue-preview-sm>

  <div
    v-else
  >unknown task size
    <br>
    {{ task }}
  </div>
</template>

<script>
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../../mixins/task-preview-mixin';

export default {
  name: 'missed-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],
  emits: [
    'click',
    'hide',
    'call',
  ],
  computed: {
    displayName() {
      return this.task.from?.name || '';
    },
    displayNumber() {
      return this.task.from?.number || '';
    },
    displayTime() {
      return prettifyTime(this.task.createdAt);
    },
  },
};
</script>

<style lang="scss" scoped>
.missed-queue-preview {
  cursor: auto;

  .missed-queue-preview-icon-wrapper {
    position: relative;
  }

  :deep(.missed-queue-preview-icon) {
    position: absolute;
    opacity: 1;
    pointer-events: auto;
    transition: var(--transition);
  }

  :deep(.missed-queue-preview-hide-action) {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    transition: var(--transition);
  }


  &:hover {
    :deep(.missed-queue-preview-icon) {
      opacity: 0;
      pointer-events: none;
    }

    :deep(.missed-queue-preview-hide-action) {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>
