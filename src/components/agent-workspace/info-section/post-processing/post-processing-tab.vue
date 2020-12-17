<template>
  <section class="post-processing">
    <h1 class="post-processing__title">{{ $t('infoSec.postProcessing.isSuccess') }}</h1>
    <article
      class="post-processing__form-wrapper"
      :class="isSuccess
         ? 'post-processing__form-wrapper--success'
          : 'post-processing__form-wrapper--failure'"
      >
      <div class="post-processing__status-wrapper">
        <wt-button
          class="post-processing__status-control"
          :outline="!isSuccess"
          color="success"
          @click="setSuccess(true)"
        >{{ $t('infoSec.postProcessing.yes') }}
        </wt-button>
        <wt-button
          class="post-processing__status-control"
          :outline="isSuccess"
          color="danger"
          @click="setSuccess(false)"
        >{{ $t('infoSec.postProcessing.no') }}
        </wt-button>
      </div>
      <success-form v-show="!isSuccess"/>
      <failure-form v-show="!!isSuccess"/>
    </article>
    <wt-button
      class="post-processing__submit-btn"
      @click="sendReporting"
    >{{ $t('reusable.send') }}
    </wt-button>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import SuccessForm from './post-processing-success-form.vue';
import FailureForm from './post-processing-failure-form.vue';

export default {
  name: 'post-processing-tab',
  components: {
    SuccessForm,
    FailureForm,
  },

  watch: {
    taskOnWorkspace: {
      handler() {
        this.resetForm();
      },
      immediate: true,
    },
  },

  computed: {
    ...mapState('reporting', {
      isSuccess: (state) => state.isSuccess,
    }),

    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
  },

  methods: {
    ...mapActions('reporting', {
      setValue: 'SET_PROPERTY',
      sendReporting: 'SEND_REPORTING',
      resetForm: 'RESET_STATE',
    }),
    setSuccess(value) {
      this.setValue({ prop: 'isSuccess', value });
    },
  },
};
</script>

<style lang="scss" scoped>
.post-processing {
  --form-min-width: 350px;
  --form-max-width: 450px;
  --success-form-box-shadow: 0 0 40px rgba(76, 175, 80, 0.3);
  --failure-form-box-shadow: 0 0 40px rgba(255, 68, 68, 0.3);

  @extend %wt-scrollbar;
  max-height: 100%;
  height: 100%;
  min-height: 0;
  overflow: scroll;

  .post-processing__title {
    @extend %typo-heading-md;
    text-align: center;
    margin: 45px 0;
  }

  .post-processing__form-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: var(--form-min-width);
    max-width: var(--form-max-width);
    padding: 10px;
    margin: auto;
    border-radius: var(--border-radius);

    &--success {
      box-shadow: var(--success-form-box-shadow);
    }
    &--failure {
      box-shadow: var(--failure-form-box-shadow);
    }
  }

  .post-processing__submit-btn {
    display: block;
    margin: 45px auto;
  }
}

.post-processing__status-wrapper {
  display: flex;
  align-items: center;
  justify-content: stretch;
  margin-bottom: 20px;

  .post-processing__status-control {
    width: 100%;

    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>
