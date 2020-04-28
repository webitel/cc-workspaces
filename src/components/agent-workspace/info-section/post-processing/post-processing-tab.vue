<template>
  <section class="post-processing">
    <h1 class="post-processing__title">{{$t('infoSec.postProcessing.isSuccess')}}</h1>
    <form class="post-processing__success-form">
      <radio-button
        v-model="isSuccess"
        :option="true"
        :label="$t('infoSec.postProcessing.yes')"
      ></radio-button>
      <radio-button
        v-model="isSuccess"
        :option="false"
        :label="$t('infoSec.postProcessing.no')"
      ></radio-button>
    </form>
    <success-form v-if="isSuccess"/>
  </section>
</template>

<script>
  import RadioButton from '../../../utils/radio-button.vue';
  import SuccessForm from './post-processing-success-form.vue';

  export default {
    name: 'post-processing-tab',
    components: {
      RadioButton,
      SuccessForm,
    },
    data: () => ({
      isSuccess: true,
    }),
  };
</script>

<style lang="scss" scoped>
  .post-processing {
    &__title {
      @extend .typo-heading-md;
      text-align: center;
      margin: calcVH(50px) 0 calcVH(60px);
    }

    &__success-form {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: calcVH(60px);

      .radio-button {
        margin: 0 calcVH(15px);
      }
    }
  }

  .processing-form {
    max-width: calcVH(530px);
    padding: 0 calcVH(20px);
    margin: auto;
  }
</style>
