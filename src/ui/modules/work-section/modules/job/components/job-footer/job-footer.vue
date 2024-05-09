<template>
  <task-footer class="job-footer">
    <wt-button
      v-if="task.allowAccept"
      color="job"
      wide
      @click="task.accept()"
    >{{ $t('reusable.accept') }}
    </wt-button>
    <wt-button
      v-if="task.allowAccept"
      color="error"
      wide
      @click="task.decline()"
    >{{ $t('reusable.decline') }}
    </wt-button>
    <wt-button
      v-if="task.allowClose"
      color="secondary"
      wide
      @click="task.close()"
    >{{ $t('reusable.close') }}
    </wt-button>
  </task-footer>
</template>

<script>
import TaskFooter from '../../../_shared/components/task-footer/task-footer.vue';
import HotkeyAction from '../../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../../hotkeys/useHotkeys';

export default {
  name: 'job-footer',
  components: { TaskFooter },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    hotkeyUnsubscribers : [],
  }),
  methods: {
    setupHotkeys() {
      const subscribers = [
        {
          event: HotkeyAction.ACCEPT,
          callback: () => {
            if (this.task.allowAccept) this.task.accept();
          },
        },
        {
          event: HotkeyAction.END,
          callback: () => {
          if (this.task.allowClose) this.task.close();
          if (this.task.allowAccept) this.task.decline();
          },
        },
      ];
      this.hotkeyUnsubscribers  = useHotkeys(subscribers);
    }
  },
  mounted() {
    this.setupHotkeys();
  },
  unmounted() {
    this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());
  },
};
</script>

<style lang="scss" scoped>
</style>
