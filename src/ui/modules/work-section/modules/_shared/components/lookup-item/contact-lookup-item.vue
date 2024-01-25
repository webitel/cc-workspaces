<template>
  <lookup-item>
    <template v-slot:before>
      <wt-avatar
        :status="userStatus"
        :size="size"
        badge
      ></wt-avatar>
    </template>

    <template v-slot:title>
      {{ item.name || item.username }}
    </template>

    <template v-slot:subtitle>
      {{ item.extension }}
    </template>

    <template v-slot:after>
      <wt-rounded-action
        :size="size"
        icon="call--filled"
        color="success"
        rounded
        @click="handleInput"
      ></wt-rounded-action>
    </template>
  </lookup-item>
</template>

<script>
import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import { parseUserPresence } from '../../../../../../../features/modules/agent-status/statusUtils/parseUserStatus';
import UserStatus from '../../../../../../../features/modules/agent-status/statusUtils/UserStatus';
import lookupItemMixin from './mixins/lookupItemMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'contact-lookup-item',
  mixins: [lookupItemMixin, sizeMixin],
  computed: {
    // NOTE: this computed is needed to return user status by priority because user can have several statuses. See this task https://my.webitel.com/browse/WTEL-3798
    userStatus() {
      const status = parseUserPresence(this.item);
      if (status[UserStatus.DND]) return AbstractUserStatus.DND;
      if (status[UserStatus.BUSY]) return AbstractUserStatus.BUSY;
      return this.item.status;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
