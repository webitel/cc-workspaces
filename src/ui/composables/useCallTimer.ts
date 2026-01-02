import { convertDuration } from '@webitel/ui-sdk/scripts';
import { differenceInSeconds } from 'date-fns';
import { computed, type ComputedRef,type Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';

type Task = {
  answeredAt?: number | string | Date;
  createdAt?: number | string | Date;
  hangupAt?: number | string | Date;
  isHold?: boolean;
} | null | undefined;

export function useCallTimer(task: Ref<Task> | ComputedRef<Task>) {
  const store = useStore();

  const now = computed(() => store.state.ui.now.now);

  const holdStartTime = ref<number | null>(null);

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

  const holdTime = computed(() => {
    const currentNow = now.value;

    if (!holdStartTime.value || !currentNow) return '00:00:00';

    const holdDate = new Date(holdStartTime.value);
    const nowDate = new Date(currentNow);

    const sec = Math.max(0, differenceInSeconds(nowDate, holdDate));

    return convertDuration(sec);
  });

  const hangupTime = computed(() => {
    const currentTask = task.value;
    const currentNow = now.value;

    if (!currentTask) return '00:00:00';

    const start = currentTask.answeredAt || currentTask.createdAt;
    const end = currentTask.hangupAt || currentNow;

    if (!start || !end) return '00:00:00';

    const startDate = new Date(start);
    const endDate = new Date(end);

    const sec = Math.max(0, differenceInSeconds(endDate, startDate));

    return convertDuration(sec);
  });

  watch(
    () => task.value.isHold,
    (isHold, wasHold) => {
      if (isHold && !wasHold) {
        holdStartTime.value = Date.now();
      } else if (!isHold && wasHold) {
        holdStartTime.value = null;
      }
    },
    { immediate: true }
  );

  return {
    now,
    startTime,
    holdTime,
    hangupTime,
    holdStartTime,
  };
}
