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
      <wt-rounded-action
        v-show="isCloseAction"
        color="danger"
        icon="chat-end"
        rounded
        wide
        @click="close"
      ></wt-rounded-action>
    </template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TaskHeader from '../../../_shared/components/task-header/task-header.vue';

export default {
  name: 'chat-header',
  components: { TaskHeader },
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
