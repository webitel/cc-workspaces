<template>
  <div class="client-feedback">
    <div class="client-feedback__content">
      <Transition name="feedback-card-transition">
        <div v-if="showAnswer" class="client-feedback__card">
          <img
            v-if="!isError"
            class="client-feedback__image"
            src="../../../../app/assets/image/client-feedback/success.png"
            alt="success"
          />
          <img
            v-else
            class="client-feedback__image"
            src="../../../../app/assets/image/client-feedback/error.png"
            alt="error"
          />
          <h3 class="client-feedback__title">
            {{
              t(`feedback.${isError ? 'error' : 'success'}.title`, {}, { locale: lang })
            }}
          </h3>
          <p class="client-feedback__description">
            {{
              t(`feedback.${isError ? 'error' : 'success'}.description`, {}, { locale: lang })
            }}
          </p>
        </div>
      </Transition>
    </div>
    <div class="client-feedback__background"></div>
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
const hk = ref(route.query.hk);

onMounted(async () => {
  try {
    await FeedbackApi.getFeedback({
      key: hk.value,
    });

    isError.value = true;
  } catch (error) {
    if (error.status === 404) {
      await FeedbackApi.setFeedback({
        key: hk.value,
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
.client-feedback {
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
    border-radius: 16px;
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
    background: url('../../../../app/assets/image/client-feedback/background.svg') no-repeat;
    background-size: cover;
  }
}

.feedback-card-transition-enter-active,
.feedback-card-transition-leave-active {
  transition: all var(--transition) ease;
}

.feedback-card-transition-enter-from,
.feedback-card-transition-leave-to {
  opacity: 0;
}
</style>
