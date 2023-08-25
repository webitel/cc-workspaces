<template>
  <component
    :is="`task-queue-preview-${size}`"
    :task="task"
    @click="$emit('click', task);"
  >
    <template
      v-if="size === 'md'"
      v-slot:icon
    >
      <wt-icon
        color="danger"
        icon="call-disconnect"
      ></wt-icon>
    </template>
    <template v-slot:avatar>
      <wt-icon
        color="danger"
        icon="call-disconnect"
      ></wt-icon>
    </template>
    <template v-slot:timer>
      <span class="missed-preview__task-time">
        {{ displayTime }}
      </span>
    </template>
    <template v-slot:title>
      {{ displayName }}
    </template>
    <template v-slot:body>
      {{ displayNumber }}
    </template>
    <template v-slot:callback>
      <wt-rounded-action
        :size="size"
        color="success"
        icon="call--filled"
        rounded
        @click.stop="makeCall"
      ></wt-rounded-action>
    </template>
  </component>
</template>

<script>
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
import { mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';

export default {
  name: 'missed-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin],

  computed: {
    ...mapState({
      client: (state) => state.client,
      config: (state) => state.config,
    }),
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
    async makeCall() {
      const CALL_PARAMS = { disableStun: this.config.CLI.stun };
      const params = {
        ...CALL_PARAMS,
        video: false,
      };
      const destination = this.task.from.number;
      const client = await this.client.getCliInstance();
      await client.call({
        destination,
        params,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.missed-preview__task-time {
  @extend %typo-body-2;
  overflow: hidden;
  flex-grow: 1;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
