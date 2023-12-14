<template>
  <div class="client-info-member">
    <wt-expansion-panel
      v-if="memberDescription"
      collapsed>
      <template v-slot:title>{{ $t('infoSec.memberDescription') }}</template>
      <template>
        <p class="client-info-member-description">{{ memberDescription }}</p>
      </template>
    </wt-expansion-panel>

    <wt-expansion-panel
      v-if="callVariables.length"
      collapsed>
      <template v-slot:title>{{ $t('infoSec.callVariables') }}</template>
      <template>
        <ul class="client-info-member-list">
          <li
            v-for="({ key, value }, idx) of callVariables"
            :key="key"
            class="client-info-member-item"
          >
            <wt-divider v-if="idx"></wt-divider>
            <div class="client-info-member-wrapper">
              <p class="client-info-member-item__key">{{ key }}:</p>
              <p class="client-info-member-item__value">{{ value }}</p>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'client-info-member',
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    callVariables() {
      return Object.keys(this.taskOnWorkspace.variables)
      .map((key) => ({ key, value: this.taskOnWorkspace.variables[key] }));
    },
    memberDescription() {
      return this.taskOnWorkspace.task?.communication?.description || '';
    },
  },
};
</script>

<style lang="scss" scoped>
.client-info-member {
  @extend %typo-body-1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);

  &-description,
  &-list {
    padding: var(--spacing-xs);
  }

  &-wrapper {
    padding: var(--spacing-xs) 0;
  }

  &-item__key {
    @extend %typo-subtitle-1;
  }
}
</style>
