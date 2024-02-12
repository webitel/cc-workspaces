<template>
  <task-queue-preview-md
    v-if="size === 'md'"
  >
    <template v-slot:icon>
      <wt-icon
        color="error"
        icon="call-missed"
      ></wt-icon>
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

    <wt-rounded-action
      color="success"
      icon="call--filled"
      rounded
      size="md"
      @click="call"
    ></wt-rounded-action>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
  >
    <template v-slot:icon>
      <wt-icon
        color="error"
        size="sm"
        icon="call-missed"
      ></wt-icon>
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
        @click="call"
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
import { mapActions } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'missed-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],

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
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
    call() {
      const { number } = this.task.from;
      return this.makeCall({ number });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
