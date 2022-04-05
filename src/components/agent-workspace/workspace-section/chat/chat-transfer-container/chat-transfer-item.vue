<template>
  <div class="chat-transfer-item">
    <wt-avatar
      v-if="type === TransferDestination.USER"
      :status="userStatus"
      badge
      class="chat-transfer-item__avatar"
    ></wt-avatar>

    <div class="chat-transfer-item__text-wrapper">
      <div class="chat-transfer-item__title">{{ item.name || item.username }}</div>
      <div class="chat-transfer-item__subtitle">{{ item.extension }}</div>
    </div>
    <div class="chat-transfer-item__action">
      <wt-icon-btn
        color="transfer"
        icon="chat-transfer--filled"
        @click="$emit('transfer', item)"
      ></wt-icon-btn>
    </div>
  </div>
</template>

<script>
import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import parseUserStatus from '../../../../../store/modules/agent-status/statusUtils/parseUserStatus';
import UserStatus from '../../../../../store/modules/agent-status/statusUtils/UserStatus';
import TransferDestination from '../../../../../enums/ChatTransferDestination.enum';

export default {
  name: 'chat-transfer-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    TransferDestination,
  }),
  computed: {
    userStatus() {
      const status = parseUserStatus(this.item.presence);
      switch (status) {
        case UserStatus.ACTIVE:
          return AbstractUserStatus.ACTIVE;
        case UserStatus.DND:
          return AbstractUserStatus.DND;
        case UserStatus.OFFLINE:
          return AbstractUserStatus.OFFLINE;
        case UserStatus.BUSY:
          return AbstractUserStatus.BUSY;
        default:
          return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-transfer-item {
  $min-height: 52px;

  display: flex;
  box-sizing: border-box;
  min-height: 52px;
  padding: var(--spacing-xs);
  transition: var(--transition);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  gap: var(--spacing-xs);

  &:hover {
    border-color: var(--accent-color);
  }

  .chat-transfer-item__avatar,
  .chat-transfer-item__action {
    flex: 0 0 var(--icon-md-size);
  }
}

.chat-transfer-item__text-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  min-width: 0;
}

.chat-transfer-item__title {
  @extend %typo-subtitle-2;
  overflow-wrap: break-word;
}

.chat-transfer-item__subtitle {
  @extend %typo-body-2;
}
</style>
