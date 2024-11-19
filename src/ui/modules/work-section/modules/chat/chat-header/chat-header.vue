<template>
  <task-header
    :size="size"
    :username="displayChatName"
  >
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
        class="chat-header-title"
        target="_blank"
      >
        {{ displayChatName }}
      </a>
      <span v-else>
        {{ displayChatName }}
      </span>
    </template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import sizeMixin from '../../../../../../app/mixins/sizeMixin.js';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';
import displayInfoMixin from '../../../../../mixins/displayInfoMixin.js';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import ChatHeaderCloseAction from './chat-header-close-action.vue';

export default {
  name: 'chat-header',
  mixins: [sizeMixin, displayInfoMixin],
  components: {
    TaskHeader,
    ChatHeaderCloseAction,
  },
  data: () => ({
    hotkeyUnsubscribers: [],
  }),
  computed: {
    ...mapState('ui/infoSec/client/contact', {
      contact: (state) => state.contact,
    }),
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
      isCloseAction: 'ALLOW_CHAT_CLOSE',
      isTransferAction: 'ALLOW_CHAT_TRANSFER',
    }),
    ...mapGetters('ui/infoSec/client/contact', {
      contactLink: 'CONTACT_LINK',
    }),
  },
  methods: {
    ...mapActions('features/chat', {
      close: 'CLOSE',
    }),
    openTab() {
      this.$emit('openTab', 'transfer');
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
          },
        },
      ];
      this.hotkeyUnsubscribers = useHotkeys(subscripers);
    },
  },
  mounted() {
    this.setupHotkeys();
  },
  unmounted() {
    this.hotkeyUnsubscribers.forEach((unsubscribe) => unsubscribe());
  },
};
</script>

<style lang="scss" scoped>
.chat-header-title {
  color: var(--text-main-color);
}

a:hover {
  text-decoration: underline;
}
</style>
