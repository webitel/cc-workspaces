<template>
  <footer class="job-footer">
    <div class="job-footer__actions" v-if="task.allowAccept">
      <wt-button
        color="task"
        wide
        @click="task.accept()"
      >{{ $t('reusable.accept') }}
      </wt-button>
      <wt-button
        color="secondary"
        wide
        @click="task.decline()"
      >{{ $t('reusable.decline') }}
      </wt-button>
    </div>
    <div v-else-if="task.allowClose">
      <wt-button
        color="secondary"
        wide
        @click="task.close()"
      >{{ $t('reusable.close') }}
      </wt-button>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'job-footer',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.job-footer__actions {
  display: flex;
  gap: 10px;
}
</style>
