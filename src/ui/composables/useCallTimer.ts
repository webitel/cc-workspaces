import { computed, type ComputedRef, type Ref } from 'vue';
import { useStore } from 'vuex';
import { convertDuration } from '@webitel/ui-sdk/scripts';

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

    const startMs =
      start instanceof Date ? start.getTime() : Number(start);

    if (Number.isNaN(startMs)) return '00:00:00';

    let sec = Math.round((currentNow - startMs) / 10 ** 3);
    sec = sec <= 0 ? 0 : sec; // handles -1 time after answer

    return convertDuration(sec);
  });

  return {
    now,
    startTime,
  };
}
