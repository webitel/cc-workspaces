<template>
  <div class="preview-profile">
      <wt-avatar
        size="xl"
        class="preview-profile__pic"
      ></wt-avatar>
    <div class="preview-profile__name">
      {{ displayName }}
    </div>
    <div class="preview-profile__number">
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

  &__name {
    @extend %typo-subtitle-2;
  }

  &__number {
    @extend %typo-body-2;
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
