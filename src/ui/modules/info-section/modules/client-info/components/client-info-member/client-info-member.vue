<template>
  <div
    class="client-info-member"
    :class="[`client-info-member--${size}`]"
  >
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
              <p class="client-info-member-item__key">{{ key }}</p>
              <p class="md markdown-body" v-html="value"></p>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MarkdownIt from 'markdown-it';
import patchMDRender from '../client-info-markdown/scripts/patchMDRender';

const md = new MarkdownIt({ linkify: true });
patchMDRender(md);

export default {
  name: 'client-info-member',
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    callVariables() {
      if (this.taskOnWorkspace.variables) {
        return Object.keys(this.taskOnWorkspace?.variables)
        .map((key) => ({
          key,
          value: md.render(this.taskOnWorkspace.variables[key]),
        }));
      } return [];
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) 0;
  }

  &-item__key {
    @extend %typo-subtitle-1;
  }

  &--sm {
    .client-info-member-wrapper {
      grid-template-columns: 1fr;
    }
  }
}
</style>
