<template>
  <div class="chat-header-close-action">
    <wt-rounded-action
      :size="size"
      color="error"
      icon="chat-end--filled"
      rounded
      wide
      @click="handleCloseAction"
    ></wt-rounded-action>
    <confirmation-popup
      v-show="isConfirmationPopup"
      @confirm="close"
      @close="isConfirmationPopup = false"
    >
      <template v-slot:text>
        {{ $t('workspaceSec.chat.confirmClose') }}
      </template>
    </confirmation-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin.js';
import ConfirmationPopup from '../../../../../../../app/components/utils/confirmation-popup.vue';

export default {
  name: 'chat-header-close-action',
  mixins: [sizeMixin],
  components: {
    ConfirmationPopup,
  },
  data: () => ({
    isConfirmationPopup: false,
  }),
  computed: {
    ...mapGetters('features/chat', {
      askChatClose: 'ASK_CHAT_CLOSE',
    }),
  },
  methods: {
    handleCloseAction() {
      if (this.askChatClose) this.isConfirmationPopup = true;
      else this.close();
    },
    close() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-header-close-action {
  width: 100%;
}
</style>
