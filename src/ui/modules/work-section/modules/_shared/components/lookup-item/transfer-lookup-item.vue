<template>
  <lookup-item
    :no-before="type === TransferDestination.CHATPLAN"
  >
    <template slot="before">
      <wt-avatar
        :status="userStatus"
        :size="size"
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
        :icon="switchIcon"
        :size="size"
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
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'transfer-lookup-item',
  mixins: [lookupItemMixin, sizeMixin],
  props: {
    type: {
      type: String,
      default: TransferDestination.USER,
    },
    currentTab: {
      type: String,
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
    switchIcon() {
      return this.currentTab === 'chat-transfer-container' ? 'chat-transfer--filled' : 'call-transfer--filled';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
