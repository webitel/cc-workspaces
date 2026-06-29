<template>
  <lookup-item>
    <template #before>
      <wt-avatar
          :status="userStatus"
          :size="size"
          :username="item.name"
          badge
      />
    </template>

    <template #title>
      {{ item.name || item.username }}
    </template>

    <template #subtitle>
      {{ item.extension }}
    </template>

    <template #after>
      <wt-rounded-action
          :size="props.size"
          :loading="props.loading"
          icon="call--filled"
          color="success"
          rounded
          @click="handleInput"
      />
    </template>
  </lookup-item>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps, defineEmits } from 'vue';

import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import AgentStatus from '@webitel/ui-sdk/src/enums/AgentStatus/AgentStatus.enum';

import parseUserStatus from '../../../../../../../features/modules/agent-status/statusUtils/parseUserStatus';
import UserStatus from '../../../../../../../features/modules/agent-status/statusUtils/UserStatus';
import { UserLookupItem } from './types/UserLookupItem'
import LookupItem from './lookup-item.vue';

interface UserLookupItemProps {
  item: any;
  loading?: boolean;
  size?: string;
}

interface UserLookupItemEmits {

}

const props = withDefaults(
    defineProps<{
      item: UserLookupItem;
      loading?: boolean;
      size?: string;
    }>(), {
      loading: false,
      size: '',
    }
    );

const emit = defineEmits<{
  input: [
    UserLookupItem,
  ];
}>();

const isOnline = computed(() =>
    props.item.status === AgentStatus.ONLINE
);

const isOffline = computed(() =>
      props.item.status === AgentStatus.OFFLINE ||
      !parseUserStatus(props.item.presence)[UserStatus.SIP]
);

const isPaused = computed(() =>
      props.item.status === AgentStatus.PAUSE ||
      props.item.status === AgentStatus.BREAK_OUT
);

// NOTE: this computed is needed to return user status(presence) by priority
// See this task https://my.webitel.com/browse/WTEL-3798
const userStatus = computed(() => {
  const status = parseUserStatus(props.item.presence);

  if (status[UserStatus.DND]) return AbstractUserStatus.DND;
  if (status[UserStatus.BUSY]) return AbstractUserStatus.BUSY;
  if (isOnline.value) return AbstractUserStatus.ONLINE;
  if (isOffline.value) return AbstractUserStatus.OFFLINE;
  if (isPaused.value) return AbstractUserStatus.PAUSE;
  if (status[UserStatus.WEB]) return AbstractUserStatus.ACTIVE;

  return AbstractUserStatus.OFFLINE;
});

const handleInput = () => {
  if (props.loading) return;

  emit('input', props.item);
};
</script>

<style lang="scss" scoped>
</style>
