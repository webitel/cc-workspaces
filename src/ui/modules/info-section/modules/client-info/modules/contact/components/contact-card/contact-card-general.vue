<template>
  <div
    class="contact-card-general"
    :class="[`contact-card-general--${props.size}`]"
  >
    <wt-avatar
      :username="name"
      class="contact-card-general__avatar"
      size="2xl"
    ></wt-avatar>

    <div class="contact-card-general__wrapper">
      <div class="contact-card-general__name">

        <a
          target="_blank"
          :href="contactLink(props.contact.id)"
          class="contact-card-general__link"
        >{{ name }}
          <wt-icon
            icon="link"
            class="contact-card-general__link-icon"
          ></wt-icon>
        </a>

      </div>

      <ul class="contact-card-general__list">
        <li
          v-if="manager"
          class="contact-card-general__item">
          <p class="contact-card-general__title">
            {{ t('infoSec.contacts.manager') }}
          </p>
          <p>{{ manager }}</p>
        </li>

        <li
          v-if="timezone"
          class="contact-card-general__item" >
          <p class="contact-card-general__title">
            {{ t('date.timezone', 1) }}
          </p>
          <p>{{ timezone }}</p>
        </li>
      </ul>
    </div>
    <wt-button
      v-if="!props.linked && isTaskActive"
      color="success"
      class="contact-card-general__button"
      @click="emit('link')"
    > {{ t('reusable.select') }}
    </wt-button>
  </div>
</template>

<script setup>
import ConfigurationAPI from '@webitel/ui-sdk/api/clients/configurations/configurations.js';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { EngineSystemSettingName } from 'webitel-sdk';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
  },
  linked: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const store = useStore();

const emit = defineEmits([
  'link',
]);

const isTaskActive = computed(() => store.getters['workspace/IS_TASK_ACTIVE']);
const name = computed(() => props.contact.name);
const contactLink = computed(() => store.getters['ui/infoSec/client/contact/CONTACT_LINK']);
const manager = computed(() => props.contact?.managers[0]?.user.name);
const timezone = computed(() => props.contact?.timezones[0]?.timezone.name);

// to get access variable for contact card page in read only mode
async function initShowFullContactState() {
  const { items } = await ConfigurationAPI.getList({
    name: [EngineSystemSettingName.ShowFullContact],
  });
  store.dispatch('ui/infoSec/client/contact/INIT_SHOW_FULL_CONTACT_STATE', items?.[0]?.value);
}

onMounted(initShowFullContactState)
</script>

<style lang="scss" scoped>
.contact-card-general {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--spacing-xs);

  &__avatar, &__link-icon {
    flex-shrink: 0;
  }

  &__wrapper {
    flex-grow: 1;
  }

  &__name {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__link {
    @extend %typo-heading-2;
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
    color: var(--link-color);
    cursor: pointer;
  }

  &__item {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  &__title {
    @extend %typo-subtitle-1;
  }

  &--sm {
    flex-direction: column;
    align-items: center;

    .contact-card-general {
      &__list {
        order: 1;
        align-self: flex-start;
      }

      &__item {
        display: block;
      }

      &__wrapper {
        display: contents;
      }

      &__button {
        width: 100%;
      }
    }
  }
}
</style>
