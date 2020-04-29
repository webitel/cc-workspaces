<template>
  <form class="processing-form processing-form__success">
    <multiselect
      class="processing-form__category"
      :value="value"
      :label="'Category'"
      :options="options"
      :api-mode="false"
    ></multiselect>
    <multiselect
      class="processing-form__subcategory"
      :value="value"
      :placeholder="'Subcategory'"
      :options="options"
      :api-mode="false"
    ></multiselect>
    <btn class="processing-form__submit">{{$t('reusable.send')}}</btn>
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
  @import '../../../../css/agent-workspace/info-section/post-processing/post-processing';
</style>
