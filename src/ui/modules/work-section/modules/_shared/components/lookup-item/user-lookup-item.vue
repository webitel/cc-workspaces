<template>
  <lookup-item>
    <template #before>
      <wt-avatar
          :status="status"
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

const presence = computed(() => parseUserStatus(props.item.presence)); // because workspase can use users without agent permissions
const agentStatus = computed(() => props.item.status);
const isAgent = computed(() => !!agentStatus.value)
const hasSip = computed(() => presence[UserStatus.SIP])

const isPaused = computed(() =>
    agentStatus.value === AgentStatus.PAUSE ||
    agentStatus.value === AgentStatus.BREAK_OUT
);

// NOTE: this computed is needed to return user status(presence) by priority
// See this task https://my.webitel.com/browse/WTEL-3798
const status = computed(() => {
  if (presence.value[UserStatus.DND]) return AbstractUserStatus.DND;
  if (presence.value[UserStatus.BUSY]) return AbstractUserStatus.BUSY;

  if (hasSip) {
    if (!isAgent.value) return AbstractUserStatus.ACTIVE;
    if (isAgent.value && agentStatus.value === AgentStatus.ONLINE) return AbstractUserStatus.ONLINE;
  }
  if (agentStatus.value === AgentStatus.OFFLINE) return AbstractUserStatus.OFFLINE;

  if (isPaused.value) {
    return AbstractUserStatus.PAUSE;
  }

  return AbstractUserStatus.OFFLINE;
});

const handleInput = () => {
  if (props.loading) return;

  emit('input', props.item);
};
</script>

<style lang="scss" scoped>
</style>
