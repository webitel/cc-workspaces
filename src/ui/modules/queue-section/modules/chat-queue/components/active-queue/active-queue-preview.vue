<template>
  <task-queue-preview-md
    v-if="size === 'md'"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
      />
    </template>

    <template v-slot:title>
      {{ displayChatName }}
    </template>

    <template v-slot:subtitle>
      {{ lastMessage }}
    </template>

    <template v-slot:timer>
      <queue-preview-timer
        :task="task"
      />
    </template>
  </task-queue-preview-md>

  <task-queue-preview-sm
    v-else-if="size === 'sm'"
    :opened="opened"
    :queue-name="displayQueueName"
    @click="$emit('click', task)"
  >

    <template v-slot:icon>
      <wt-icon
        :icon="displayIcon"
        size="sm"
      />
    </template>

    <template v-slot:tooltip-title>
      {{ displayChatName }}
    </template>

    <template v-slot:tooltip-subtitle>
      {{ lastMessage }}
    </template>

    <template v-slot:title>
      {{ displayChatName }}
    </template>

    <template v-slot:subtitle>
      <queue-preview-timer
        :task="task"
      />
    </template>
  </task-queue-preview-sm>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import displayInfoMixin from '../../../../../../mixins/displayInfoMixin';
import taskPreviewMixin from '../../../_shared/mixins/task-preview-mixin';
import messengerIcon from '../../../_shared/scripts/messengerIcon.js';

export default {
  name: 'active-queue-preview',
  mixins: [taskPreviewMixin, sizeMixin, displayInfoMixin],
  computed: {
    lastMessage() {
      const lastMessage = this.task.messages[this.task.messages.length - 1] || {};
      return lastMessage.file ? lastMessage.file.name : lastMessage.text;
    },
    displayIcon() {
      const member = this.task.members[0];
      return messengerIcon(member.type);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
