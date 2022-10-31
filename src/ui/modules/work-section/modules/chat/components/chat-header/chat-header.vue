<template>
  <task-header>
    <template v-slot:after-avatar>
      <wt-rounded-action
        v-show="isTransferAction"
        color="transfer"
        icon="chat-transfer"
        rounded
        wide
        @click="$emit('openTab', 'transfer')"
      ></wt-rounded-action>
      <chat-header-close-action
        v-show="isCloseAction"
        @click="close"
      ></chat-header-close-action>
    </template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';
import ChatHeaderCloseAction from './chat-header-close-action.vue';

export default {
  name: 'chat-header',
  components: {
    TaskHeader,
    ChatHeaderCloseAction,
  },
  computed: {
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
