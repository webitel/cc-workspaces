<template>
  <article class="queue-preview">

    <header class="preview-header">
      <span class="preview-header__name">{{displayName | truncate(18)}}</span>
      <!--v-for for timer not to resize on digit width change-->
      <div class="preview-header__time preview-header__time__bold">
          <span
            class="preview-header__time-digit"
            v-for="(digit, key) of computeCreatedTime.split('')"
            :key="key"
          >{{digit}}</span>
      </div>
    </header>

    <div class="chat-preview__message">
      {{message | truncate(30)}}
    </div>
  </article>
</template>

<script>
import callTimer from '../../../../../mixins/callTimerMixin';
import displayInfo from '../../../../../mixins/displayInfoMixin';

export default {
  name: 'chat-queue-preview',
  mixins: [callTimer, displayInfo],
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    displayName() {
      return this.task.otherChannels.map((channel) => channel.name).join(', ');
    },
    message() {
      // assume message type == 'text'
      return this.task.messages[this.task.messages.length - 1].text;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../../css/agent-workspace/queue-section/queue-task-preview';
</style>
