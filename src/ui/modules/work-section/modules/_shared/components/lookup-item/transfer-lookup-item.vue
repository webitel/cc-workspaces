<template>
  <lookup-item
    :no-before="type === TransferDestination.CHATPLAN"
  >
    <template slot="before">
      <wt-avatar
        :status="userStatus"
        badge
      ></wt-avatar>
    </template>

    <template slot="title">
      {{ item.name || item.username }}
    </template>

    <template slot="subtitle">
      {{ item.extension }}
    </template>

    <template slot="after">
      <wt-icon-btn
        color="transfer"
        icon="chat-transfer--filled"
        @click="handleInput"
      ></wt-icon-btn>
    </template>
  </lookup-item>
</template>

<script>
import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import parseUserStatus from '../../../../../../../features/modules/agent-status/statusUtils/parseUserStatus';
import UserStatus from '../../../../../../../features/modules/agent-status/statusUtils/UserStatus';
import TransferDestination from '../../../chat/enums/ChatTransferDestination.enum';
import lookupItemMixin from './mixins/lookupItemMixin';

export default {
  name: 'transfer-lookup-item',
  mixins: [lookupItemMixin],
  props: {
    type: {
      type: String,
      default: TransferDestination.USER,
    },
  },
  data: () => ({
    TransferDestination,
  }),
  computed: {
    userStatus() {
      const status = parseUserStatus(this.item.presence);
      if (status[UserStatus.DND]) return AbstractUserStatus.DND;
      if (status[UserStatus.BUSY]) return AbstractUserStatus.BUSY;
      if (status[UserStatus.SIP] || status[UserStatus.WEB]) return AbstractUserStatus.ACTIVE;
      return AbstractUserStatus.OFFLINE;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
