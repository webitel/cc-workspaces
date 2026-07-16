<template>
  <lookup-item>
    <template #before>
      <slot name="before">
        <wt-avatar
          :username="usernameAvatar"
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
      <span>{{ item?.extension }}</span>
      <div v-if="teamName"> {{ teamName }} </div>
    </template>

    <template #after>
      <div class="transfer-actions">
        <slot name="actions" :item="item">
          <wt-rounded-action
            color="transfer"
            :icon="`${state}-transfer--filled`"
            :loading="loadingTransfer"
            rounded
            @click="handleInput"
          />
        </slot>
      </div>
    </template>
  </lookup-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { getUserStatusByPriority } from '../../../../../../../features/modules/agent-status/statusUtils/getUserStatusByPriority';
import TransferDestination from '../../../chat/enums/ChatTransferDestination.enum';
import LookupItem from './lookup-item.vue';
import { TransferItem } from './types/transfer-lookup-item';

interface TransferLookupItemProps {
	item: TransferItem;
	type: string;
	src?: string;
	size?: string;
	showStatus?: boolean;
	showTeamName?: boolean;
	showUserNameAvatar?: boolean;
	presenceStatusField?: string;
	loadingTransfer?: boolean;
}

interface TransferLookupItemEmits {
	input: [
		item: TransferItem,
	];
}

const props = withDefaults(defineProps<TransferLookupItemProps>(), {
	type: TransferDestination.USER,
	size: '',
	src: '',
	showStatus: true,
	showTeamName: false,
	showUserNameAvatar: false,
	presenceStatusField: 'presence',
	loadingTransfer: false,
});

const emit = defineEmits<TransferLookupItemEmits>();

const store = useStore();

const state = computed<string>(
	() => store.getters['workspace/WORKSRACE_STATE'],
);
const userStatus = computed(() => {
	if (!props.showStatus) return undefined;
	return getUserStatusByPriority({
		presence: props.item[props.presenceStatusField],
		agentStatus: props.item?.status,
	});
});

const badge = computed(
	() => props.type !== TransferDestination.CHATPLAN && props.showStatus,
);

const name = computed(
	() => props.item?.name || props.item?.username || props.item?.queue?.name,
);
const teamName = computed(() => props.showTeamName && props.item?.team?.name);
const usernameAvatar = computed(() => {
	if (props.showUserNameAvatar) {
		return props.item?.name || props.item?.username;
	}

	return props.item?.username || props.item?.name;
});

const handleInput = () => {
	emit('input', props.item);
};
</script>

<style lang="scss" scoped>
.transfer-actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}
</style>
