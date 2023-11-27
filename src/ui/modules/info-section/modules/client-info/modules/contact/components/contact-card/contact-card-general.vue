<template>
  <div
    class="contact-info-general"
    :class="[`contact-info-general--${props.size}`]"
  >
    <wt-avatar
      size="2xl"
      :username="name"
    ></wt-avatar>

    <div class="contact-info-general__wrapper">
      <div class="contact-info-general__name">
        <wt-item-link
          target="_blank"
          link="https://dev.webitel.com/crm/contacts/201/communications"
          class="contact-info-general__link"
        >{{ name }}
        </wt-item-link>

        <wt-icon-btn
          icon="link"
        ></wt-icon-btn>
      </div>


      <ul class="contact-info-general__list">
        <li class="contact-info-general__item" v-if="manager">
          <div class="contact-info-general__title">
            {{ t('infoSec.contacts.manager') }}
          </div>
          <div>{{ manager }}</div>
        </li>

        <li class="contact-info-general__item" v-if="timezone">
          <div class="contact-info-general__title">
            {{ t('infoSec.contacts.timezone') }}
          </div>
          <div>{{ timezone }}</div>
        </li>
      </ul>
    </div>
    <wt-button
      color="success"
      class="contact-info-general__button"
    > {{ t('infoSec.contacts.select') }}
    </wt-button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  contact: {
    type: Object,
  },
});

const { t } = useI18n();

const name = computed(() => props.contact.name?.commonName);
const manager = computed(() => props.contact.managers[0].user.name);
const timezone = computed(() => props.contact.timezones[0].timezone.name);
</script>

<style lang="scss" scoped>
.contact-info-general {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: space-between;
    padding: var(--spacing-xs);
    align-items: flex-start;

  &__wrapper {
    flex-grow: 1;
  }

  &__name {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__link {
    @extend %typo-heading-2;
    color: var(--link-color);
  }

  &__item {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  &__title {
    @extend %typo-subtitle-1;
  }

  &__panels {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &--sm {
      flex-direction: column;
      align-items: center;

    .contact-info-general {
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
