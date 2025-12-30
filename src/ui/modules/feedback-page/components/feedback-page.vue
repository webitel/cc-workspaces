<template>
  <div class="feedback-page">
    <div class="feedback-page__content">
        <div v-if="showAnswer" class="feedback-page__card">
          <img
            v-if="!isError"
            class="feedback-page__image"
            src="../../../../app/assets/image/feedback-page/success.png"
            alt="success"
          />
          <img
            v-else
            class="feedback-page__image"
            src="../../../../app/assets/image/feedback-page/error.png"
            alt="error"
          />
          <h3 class="feedback-page__title">
            {{
              t(`feedback.${isError ? 'error' : 'success'}.title`, {}, { locale: lang })
            }}
          </h3>
          <p class="feedback-page__description">
            {{
              t(`feedback.${isError ? 'error' : 'success'}.description`, {}, { locale: lang })
            }}
          </p>
        </div>
    </div>
    <div class="feedback-page__background"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import FeedbackApi from '../api/feedback.js';

const route = useRoute();

const { t } = useI18n();

const showAnswer = ref(false);
const isError = ref(false);
const lang = ref<string>((route.query.lang as string) || 'en');
const rating = ref(route.query.rating || 0);
const hashKey = ref(route.query.hk);

onMounted(async () => {
  try {
    await FeedbackApi.getFeedback({
      key: hashKey.value,
    });

    // @author @stanislav-kozak
    // If feedback already set, we should display error state
    isError.value = true;
  } catch (error) {
    // @author @stanislav-kozak
    // If feedback not found (404 error), we should set feedback by rating from params
    if (error.status === 404) {
      await FeedbackApi.setFeedback({
        key: hashKey.value,
        rating: rating.value,
      });
    } else {
      isError.value = true;
    }
  }
  showAnswer.value = true;
});
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

.feedback-page {
  &__content {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    z-index: 5;
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    padding: var(--spacing-lg);
    background: var(--white);
    border-radius: var(--border-radius);
  }

  &__image {
    width: 200px;
    height: 200px;
  }

  &__title {
    @extend %typo-heading-2;
    text-align: center;

  }

  &__description {
    @extend %typo-body-1;
    text-align: center;
    max-width: 240px;
  }

  &__background {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
    min-height: 100%;
    min-width: 100%;
    height: 1080px;
    width: 1920px;
    background: url('../../../../app/assets/image/feedback-page/background.svg') no-repeat;
    background-size: cover;
  }
}
</style>
