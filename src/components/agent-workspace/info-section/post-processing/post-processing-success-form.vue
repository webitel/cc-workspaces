<template>
  <form class="processing-form processing-form__success">
    <multiselect
      class="post-processing__category"
      :value="value"
      :label="'Category'"
      :options="options"
      :api-mode="false"
    ></multiselect>
    <multiselect
      class="post-processing__subcategory"
      :value="value"
      :placeholder="'Subcategory'"
      :options="options"
      :api-mode="false"
    ></multiselect>
    <btn class="post-processing__submit">{{$t('reusable.send')}}</btn>
  </form>
</template>

<script>
  import Btn from '../../../utils/btn.vue';
  import Multiselect from '../../../utils/multiselect.vue';

  export default {
    name: 'post-processing-success-form',
    components: {
      Btn,
      Multiselect,
    },
    data: () => ({
      value: [],
      options: [],
    }),
  };
</script>

<style lang="scss" scoped>
  .post-processing__category,
  .post-processing__subcategory {
    margin-bottom: calcVH(20px);
  }

  .post-processing__submit {
    display: block;
    min-width: calcVH(110px);
    margin: calcVH(60px) auto auto;
  }
</style>
