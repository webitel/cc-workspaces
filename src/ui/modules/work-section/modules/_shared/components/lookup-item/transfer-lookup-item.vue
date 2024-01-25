<template>
  <lookup-item>
    <template v-slot:before>
      <slot name="before">
        <wt-avatar
          :src="src"
          :size="size"
          :badge="type !== TransferDestination.CHATPLAN"
          :status="userStatus"
        ></wt-avatar>
      </slot>
    </template>

    <template v-slot:title>
      {{ item.name || item.username }}
    </template>

    <template v-slot:subtitle>
      {{ item.extension }}
    </template>

    <template v-slot:after>
      <wt-rounded-action
        color="transfer"
        :icon="`${state}-transfer--filled`"
        rounded
        @click="handleInput"
      ></wt-rounded-action>
    </template>
  </lookup-item>
</template>

<script>
import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import { mapGetters } from 'vuex';
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
    src: {
      type: String,
    },
  },
  data: () => ({
    TransferDestination,
  }),
  computed: {
    ...mapGetters('workspace', {
      state: 'WORKSRACE_STATE',
    }),
    userStatus() {
      // NOTE: this computed is needed to return user status by priority because user can have several statuses. See this task https://my.webitel.com/browse/WTEL-3798
      const status = parseUserStatus(this.item, 'presence');
      if (status[UserStatus.DND]) return AbstractUserStatus.DND;
      if (status[UserStatus.BUSY]) return AbstractUserStatus.BUSY;
      return this.item.status;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
