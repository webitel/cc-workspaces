<template>
  <div class="preview-profile">
      <wt-avatar
        size="xl"
        class="preview-profile__pic"
      ></wt-avatar>
    <div class="preview-profile__name typo-subtitle-2">
      {{ displayName }}
    </div>
    <div class="preview-profile__number typo-body-2">
      {{ displayNumber }}
    </div>
    <wt-chip
      v-if="displayQueueName"
      color="secondary">
      {{ displayQueueName }}
    </wt-chip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import displayInfoMixin from '../../../../../mixins/displayInfoMixin';

export default {
  name: 'CallPreviewProfile',
  mixins: [displayInfoMixin, sizeMixin],
  computed: {
    ...mapGetters('workspace', {
      task: 'TASK_ON_WORKSPACE',
    }),
  },
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.preview-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-sm);

  &__pic {
    margin-bottom: var(--spacing-sm);
  }

  &__number {
    margin-bottom: var(--spacing-sm);
  }

  .wt-chip {
    max-width: 100%;
    display: inline-block;
    overflow-wrap: break-word;
    white-space: pre-line;
  }
}
</style>
