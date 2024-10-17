<template>
  <task-header :size="size" :username="contact?.name">
    <template v-slot:after-avatar>
      <wt-rounded-action
        v-show="isTransferAction"
        :size="size"
        color="transfer"
        icon="chat-transfer--filled"
        rounded
        wide
        @click="openTab"
      />
      <chat-header-close-action
        v-show="isCloseAction"
        :size="size"
        @click="close"
      />
    </template>
    <template v-slot:title>
      <a
        v-if="contact?.id"
        :href="contactLink(contact?.id)"
        target="_blank">
        {{ contact?.name }}
      </a>
      <span v-else>
        {{ title }}
      </span>
    </template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import displayInfoMixin from '../../../../../mixins/displayInfoMixin.js';
import sizeMixin from '../../../../../../app/mixins/sizeMixin.js';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import ChatHeaderCloseAction from './chat-header-close-action.vue';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';

export default {
  name: 'chat-header',
  mixins: [sizeMixin, displayInfoMixin],
  components: {
    TaskHeader,
    ChatHeaderCloseAction,
  },
  data: () => ({
    hotkeyUnsubscribers : [],
  }),
  computed: {
    ...mapState('ui/infoSec/client/contact', {
      contact: (state) => state.contact,
    }),
    ...mapGetters('workspace', {
      task: 'TASK_ON_WORKSPACE',
    }),
    ...mapGetters('features/chat', {
      isCloseAction: 'ALLOW_CHAT_CLOSE',
      isTransferAction: 'ALLOW_CHAT_TRANSFER',
    }),
    ...mapGetters('ui/infoSec/client/contact', {
      contactLink: 'CONTACT_LINK',
    }),
    title() {
      return this.task?.members[this.task?.members.length - 1]?.name;
    }
  },
  methods: {
    ...mapActions('features/chat', {
      close: 'CLOSE',
    }),
    openTab() {
      this.$emit('openTab', 'transfer')
    },
    setupHotkeys() {
      const subscripers = [
        {
          event: HotkeyAction.END,
          callback: this.close,
        },
        {
          event: HotkeyAction.TRANSFER,
          callback: () => {
            if (this.isTransferAction) this.openTab();
          }
        }
      ];
      this.hotkeyUnsubscribers  = useHotkeys(subscripers);
    },
  },
  mounted() {
    this.setupHotkeys();
  },
  unmounted() {
    this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());
  },
};
</script>

<style lang="scss" scoped>
a:hover {
  text-decoration: underline;
}
</style>
