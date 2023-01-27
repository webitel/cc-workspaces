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
    <div class="preview-profile__queue">
      {{ displayQueueName }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import displayInfoMixin from '../../../../../mixins/displayInfoMixin';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'call-preview-profile',
  mixins: [displayInfoMixin, sizeMixin],
  computed: {
    ...mapGetters('workspace', {
      task: 'TASK_ON_WORKSPACE',
    }),
  },
};
</script>

<style lang="scss" scoped>
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
  }
}
</style>
