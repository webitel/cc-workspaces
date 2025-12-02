import { computed, type ComputedRef, type Ref } from 'vue';
import { useStore } from 'vuex';
import { addSeconds, startOfDay, format } from 'date-fns';

type Task = {
  answeredAt?: number | string | Date;
  createdAt?: number | string | Date;
} | null | undefined;

const EMPTY_TIME = '00:00:00';

function formatDurationToHMS(seconds: number): string {
  if (seconds <= 0) return EMPTY_TIME;

  const base = startOfDay(new Date(0));
  const dateWithSeconds = addSeconds(base, seconds);

  return format(dateWithSeconds, 'HH:mm:ss');
}

export function useCallTimer(task: Ref<Task> | ComputedRef<Task>) {
  const store = useStore();

  const now = computed(() => store.state.ui.now.now);

  const startTime = computed(() => {
    const currentTask = task.value;
    const currentNow = now.value;

    if (!currentTask || !currentNow) return EMPTY_TIME;

    const start = currentTask.answeredAt || currentTask.createdAt;
    if (!start) return EMPTY_TIME;

    const startMs =
      start instanceof Date ? start.getTime() : Number(start);

    if (Number.isNaN(startMs)) return EMPTY_TIME;

    const sec = Math.max(0, Math.round((currentNow - startMs) / 1000));

    return formatDurationToHMS(sec);
  });

  return {
    now,
    startTime,
  };
}
