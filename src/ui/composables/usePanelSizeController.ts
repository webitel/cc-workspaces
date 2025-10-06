import { ref, computed, getCurrentInstance } from 'vue';

export function usePanelSizeController() {
  const instance = getCurrentInstance();
  const breakpoint = instance?.proxy?.$breakpoint;

  const queueSecCollapsed = ref(false);
  const workspaceSecCollapsed = ref(true);
  const infoSecCollapsed = ref(false);

  const collapsible = computed(() => breakpoint.mdAndUp);

  const queueSecSize = computed(() => {
    if (collapsible.value && queueSecCollapsed.value) return 'sm';
    if (breakpoint.md) return 'sm';
    if (breakpoint.lg) return 'md';
    return 'md';
  });

  const workspaceSecSize = computed(() => {
    if (collapsible.value && !workspaceSecCollapsed.value) return 'md';
    if (breakpoint.md) return 'sm';
    if (breakpoint.lg) return 'sm';
    return 'sm';
  });

  const infoSecSize = computed(() => {
    if (collapsible.value && infoSecCollapsed.value) return 'sm';
    if (breakpoint.mdAndDown) return 'sm';
    if (breakpoint.lg) return 'md';
    return 'md';
  });

  const resizeQueuePanel = () => {
    queueSecCollapsed.value = !queueSecCollapsed.value;
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
