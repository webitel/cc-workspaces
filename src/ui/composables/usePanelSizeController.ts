import { ComponentSize } from '@webitel/ui-sdk/src/enums/ComponentSize/ComponentSize.ts';
import { computed, getCurrentInstance, ref } from 'vue';

const queueSecCollapsed = ref(false);
const workspaceSecCollapsed = ref(true);
const infoSecCollapsed = ref(false);

export function usePanelSizeController() {
	const instance = getCurrentInstance();
	const breakpoint = instance?.proxy?.$breakpoint;

	const collapsible = computed(() => breakpoint.mdAndUp);

	const queueSecSize = computed(() => {
		if (collapsible.value && queueSecCollapsed.value) return ComponentSize.SM;
		if (breakpoint.md) return ComponentSize.SM;
		if (breakpoint.lg) return ComponentSize.MD;
		return ComponentSize.MD;
	});

	const workspaceSecSize = computed(() => {
		if (collapsible.value && !workspaceSecCollapsed.value)
			return ComponentSize.MD;
		if (breakpoint.md) return ComponentSize.SM;
		if (breakpoint.lg) return ComponentSize.SM;
		return ComponentSize.SM;
	});

	const infoSecSize = computed(() => {
		if (collapsible.value && infoSecCollapsed.value) return 'sm';
		if (breakpoint.mdAndDown) return 'sm';
		if (breakpoint.lg) return 'md';
		return 'md';
	});

	const resizeQueuePanel = (collapsed = !queueSecCollapsed.value) => {
		queueSecCollapsed.value = collapsed;
	};

	const resizeWorkspacePanel = () => {
		workspaceSecCollapsed.value = !workspaceSecCollapsed.value;
		infoSecCollapsed.value = !workspaceSecCollapsed.value;
	};

	const resizeInfoPanel = () => {
		infoSecCollapsed.value = !infoSecCollapsed.value;
		workspaceSecCollapsed.value = !infoSecCollapsed.value;
	};

	return {
		queueSecCollapsed,
		workspaceSecCollapsed,
		infoSecCollapsed,
		queueSecSize,
		workspaceSecSize,
		infoSecSize,
		collapsible,
		resizeQueuePanel,
		resizeWorkspacePanel,
		resizeInfoPanel,
	};
}
