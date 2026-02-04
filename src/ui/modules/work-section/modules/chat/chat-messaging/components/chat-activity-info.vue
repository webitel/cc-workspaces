<template>
  <div class="chat-activity-info">
    <wt-divider />
      <div class="chat-activity-info__content">
        <wt-icon
          :icon="content.icon"
          :color="content.iconColor"
          size="sm"
        />
        <p class="chat-activity-info__title typo-caption">
          {{ content.title }}
        </p>
        <wt-hint v-if="props.provider">
          <div class="chat-activity-info-provider">
            <wt-icon :icon="iconType[props.provider]" />
            <p class="chat-activity-info-provider__title">
              {{ props.gateway || props.provider }}
            </p>
          </div>
        </wt-hint>
      </div>
    <wt-divider />
  </div>
</template>

<script setup>
// component show is chat started or ended
import iconType from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ProviderIconType.enum';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  ended: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    default: '',
  },
  gateway: {
    type: String,
    default: '',
  },

});

const { t } = useI18n();

const content = computed(() =>
  props.ended
    ? { icon: 'chat-end',
      iconColor: 'error',
      title: t('workspaceSec.chat.chatEnded') }
    : { icon: 'chat',
      iconColor: 'success',
      title: t('workspaceSec.chat.chatStarted') }
)

</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-activity-info {
  display: flex;
  gap: var(--spacing-2xs);
  align-items: center;

  &__content {
    display: flex;
    align-items: center;
    cursor: default;
    gap: var(--spacing-2xs)
  }

  &-provider {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__title,
  &-provider__title {
    white-space: nowrap;
  }
}


</style>
