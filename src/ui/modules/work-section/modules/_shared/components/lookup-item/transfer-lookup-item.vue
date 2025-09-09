<template>
  <lookup-item>
    <template #before>
      <slot name="before">
        <wt-avatar
          :src="src"
          :size="size"
          :badge="badge"
          :status="userStatus"
        ></wt-avatar>
      </slot>
    </template>

    <template #title>
      {{ name }}
    </template>

    <template #subtitle>
      <span>{{ extension }}</span>
      <div v-if="teamName"> {{ teamName }} </div>
    </template>

    <template #after>
      <div class="transfer-actions">
        <wt-rounded-action
          v-if="showTransferButton"
          color="transfer"
          :icon="`${state}-transfer--filled`"
          :loading="showLoader"
          rounded
          @click="handleInput"
        />
        <wt-rounded-action
          v-if="showConsultationTransfer"
          color="transfer"
          icon="consultative-transfer"
          :loading="showLoader"
          rounded
          @click="handleConsultationTransfer"
        />
      </div>
    </template>
  </lookup-item>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import { transferItem } from './types/transfer-lookup-item.js';

import AbstractUserStatus from '@webitel/ui-sdk/src/enums/AbstractUserStatus/AbstractUserStatus.enum';
import AgentStatus from '@webitel/ui-sdk/src/enums/AgentStatus/AgentStatus.enum';
import parseUserStatus from '../../../../../../../features/modules/agent-status/statusUtils/parseUserStatus';
import UserStatus from '../../../../../../../features/modules/agent-status/statusUtils/UserStatus';
import TransferDestination from '../../../chat/enums/ChatTransferDestination.enum';
import LookupItem from './lookup-item.vue';

interface TransferLookupItemProps {
  item: transferItem;
  type: string;
  src?: string;
  size?: string;
  showTransferButton: boolean;
  showConsultationTransfer: boolean;
  showStatus?: boolean;
}

interface TransferLookupItemEmits {
  (e: 'input', item: transferItem): void;
  (e: 'consultation', item: transferItem): void;
}

const props = withDefaults(defineProps<TransferLookupItemProps>(), {
  type: TransferDestination.USER,
  size: '',
  src: '',
  showTransferButton: true,
  showConsultationTransfer: false,
  showStatus: true
});


const emit = defineEmits<TransferLookupItemEmits>();

const store = useStore();
const showLoader = ref(false);

const state = computed<string>(() => store.getters['workspace/WORKSRACE_STATE']);

const userStatus = computed(() => {
  if (!props.showStatus) return undefined;
  const statusMap = parseUserStatus(props.item?.presence);
  if (statusMap[UserStatus.DND]) return AbstractUserStatus.DND;
  if (statusMap[UserStatus.BUSY]) return AbstractUserStatus.BUSY;
  if ((props.item?.status === AgentStatus.OFFLINE || !props.item?.status) && (statusMap[UserStatus.SIP] || statusMap[UserStatus.WEB])) {
    return AbstractUserStatus.ACTIVE;
  }
  if (props.item?.status === AgentStatus.ONLINE) return AbstractUserStatus.ONLINE;
  if (props.item?.status === AgentStatus.PAUSE) return AbstractUserStatus.PAUSE;
  return AbstractUserStatus.OFFLINE;
});

const badge = computed(() =>
  props.type !== TransferDestination.CHATPLAN && props.showStatus
)

const name = computed(() => props.item?.name || props.item?.username || props.item?.queue?.name);
const extension = computed(() => props.item?.extension);
const teamName = computed(() => props.item?.team?.name);

const handleInput = () => {
  if (showLoader.value) return;
  showLoader.value = true;
  emit('input', props.item);
  showLoader.value = false;
};

const handleConsultationTransfer = () => {
  if (showLoader.value) return;
  showLoader.value = true;
  emit('consultation', props.item);
  showLoader.value = false;
};
</script>

<style lang="scss" scoped>
.transfer-actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}
</style>
