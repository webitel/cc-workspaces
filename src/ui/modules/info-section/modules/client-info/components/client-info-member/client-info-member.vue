<template>
  <div
    class="client-info-member"
    :class="[`client-info-member--${size}`]"
  >
    <wt-expansion-panel
      v-if="memberDescription"
      :collapsed="collapsed"
    >
      <template #title>{{ $t('infoSec.memberDescription') }}</template>
      <template #default>
        <p class="client-info-member-description">{{ memberDescription }}</p>
      </template>
    </wt-expansion-panel>

    <wt-expansion-panel
      v-if="variables.length"
      :collapsed="collapsed"
    >
      <template #title>{{ $t('infoSec.variables') }}</template>
      <template #default>
        <ul class="client-info-member-list">
          <li
            v-for="({ key, value }, idx) of variables"
            :key="key"
            class="client-info-member-item"
          >
            <wt-divider v-if="idx"></wt-divider>
            <div class="client-info-member-wrapper">
              <p class="client-info-member-item__key">{{ key }}:</p>
              <p class="client-info-member-item__value md markdown-body" v-html="value"></p>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </div>
</template>

<script>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import MarkdownIt from 'markdown-it';
import { mapGetters } from 'vuex';

import patchMDRender from '../client-info-markdown/scripts/patchMDRender';

const md = new MarkdownIt({ linkify: true });
patchMDRender(md);

export default {
  name: 'ClientInfoMember',
  props: {
    size: {
      type: String,
      default: ComponentSize.MD,
    },
    collapsed: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    variables() {
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

  &-item__value {
    @extend %typo-body-1;
  }

  &--sm {
    .client-info-member-wrapper {
      grid-template-columns: 1fr;
    }
  }
}
</style>
