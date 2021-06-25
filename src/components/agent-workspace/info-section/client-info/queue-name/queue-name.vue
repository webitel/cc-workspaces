<template>
  <section class="preview__queue">
    <section class="queue-preview-badges">
      <div class="queue-name-wrapper">
        <wt-badge color="secondary" v-if="queueName">
          {{ queueName }}
        </wt-badge>
      </div>
    </section>
  </section>
</template>

<script>
import {mapGetters} from 'vuex';
import displayInfo from '../../../../../mixins/displayInfoMixin';

export default {
  name: 'queue-name',
  mixins: [displayInfo],
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    queueName() {
      return this.taskOnWorkspace.task?.queue?.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.preview__queue {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--component-padding);
  background-color: var(--secondary-color-50);
  border-radius: var(--border-radius)
}

//.queue-name-wrapper {
//  @media screen and (max-width: 1366px){
//    display: block;
//  }
//}
</style>
