import { computed, type Ref, type ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { convertDuration } from '@webitel/ui-sdk/scripts';
import { differenceInSeconds } from 'date-fns';

type Task = {
  answeredAt?: number | string | Date;
  createdAt?: number | string | Date;
} | null | undefined;

export function useCallTimer(task: Ref<Task> | ComputedRef<Task>) {
  const store = useStore();

  const now = computed(() => store.state.ui.now.now);

  const startTime = computed(() => {
    const currentTask = task.value;
    const currentNow = now.value;

    if (!currentTask || !currentNow) return '00:00:00';

    const start = currentTask.answeredAt || currentTask.createdAt;
    if (!start) return '00:00:00';

    const startDate = new Date(start);
    const nowDate = new Date(currentNow);

    const sec = Math.max(0, differenceInSeconds(nowDate, startDate));

    return convertDuration(sec);
  });

  return {
    now,
    startTime,
  };
}
