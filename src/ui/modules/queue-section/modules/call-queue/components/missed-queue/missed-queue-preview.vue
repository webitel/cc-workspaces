<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    class="missed-queue-preview"
    @click="$emit('click')"
  >
    <template #icon>
      <div class="missed-preview-icon-wrapper">
        <wt-icon
          class="missed-queue-preview-icon"
          color="error"
          icon="call-missed"
        />
        <wt-icon-btn
          class="missed-queue-preview-hide-action"
          icon="close"
          @click.prevent="$emit('hide')"
        />
      </div>
    </template>

    <template #title>
      {{ displayName }}
    </template>

    <template #subtitle>
      {{ displayNumber }}
    </template>

    <template #timer>
      {{ displayTime }}
    </template>

    <template #quick-action>
      <wt-rounded-action
        color="success"
        icon="call--filled"
        :loading="showLoader"
        rounded
        size="md"
        @click.prevent="call"
      />
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    class="missed-queue-preview"
  >
    <template #icon>
      <div class="missed-preview-icon-wrapper">
        <wt-icon
          class="missed-queue-preview-icon"
          color="error"
          size="sm"
          icon="call-missed"
        />
        <wt-icon-btn
          class="missed-queue-preview-hide-action"
          icon="close"
          size="sm"
          @click.prevent="$emit('hide')"
        />
      </div>
    </template>

    <template #tooltip-title>
      {{ displayName }}
    </template>

    <template #tooltip-subtitle>
      {{ displayNumber }}
    </template>

    <template #title>
      {{ displayName }}
    </template>

    <template #subtitle>
      {{ displayTime }}
    </template>

    <template #actions>
      <wt-rounded-action
        color="success"
        icon="call--filled"
        :loading="showLoader"
        rounded
        size="sm"
        @click.prevent="call"
      />
    </template>
  </task-queue-preview-sm>

  <div
    v-else
  >
    {{ $t('reusable.unknownTaskSize') }}
    <br>
    {{ task }}
  </div>
</template>

<script>
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';

import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'MissedQueuePreview',
  mixins: [taskPreviewMixin, sizeMixin],
  emits: [
    'click',
    'hide',
    'call',
  ],
  data() {
    return {
      showLoader: false,
    }
  },
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
  methods: {
    call() {
      if(this.showLoader) return;

      this.showLoader = true;
      this.$emit('call');
      this.showLoader = false;
    },
  }
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
