<template>
  <task-header :size="size">
    <template v-slot:after-avatar>
      <wt-rounded-action
        v-show="isTransferAction"
        :size="size"
        color="transfer"
        icon="chat-transfer--filled"
        rounded
        wide
        @click="$emit('openTab', 'transfer')"
      ></wt-rounded-action>
      <chat-header-close-action
        v-show="isCloseAction"
        :size="size"
        @click="close"
      ></chat-header-close-action>
    </template>
    <template v-slot:title>
      {{ displayChatName }}
    </template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import displayInfoMixin from '../../../../../../mixins/displayInfoMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';
import ChatHeaderCloseAction from './chat-header-close-action.vue';

export default {
  name: 'chat-header',
  mixins: [sizeMixin, displayInfoMixin],
  components: {
    TaskHeader,
    ChatHeaderCloseAction,
  },
  computed: {
    ...mapGetters('workspace', {
      task: 'TASK_ON_WORKSPACE',
    }),
    ...mapGetters('features/chat', {
      isCloseAction: 'ALLOW_CHAT_CLOSE',
      isTransferAction: 'ALLOW_CHAT_TRANSFER',
    }),
  },
  methods: {
    ...mapActions('features/chat', {
      close: 'CLOSE',
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
