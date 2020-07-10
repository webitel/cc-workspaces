<template>
  <form class="processing-form processing-form__success">
<!--    <multiselect-->
<!--      class="processing-form__category"-->
<!--      :value="[]"-->
<!--      :label="$t('infoSec.postProcessing.category')"-->
<!--      :options="[]"-->
<!--      :api-mode="false"-->
<!--    ></multiselect>-->
<!--    <multiselect-->
<!--      class="processing-form__subcategory"-->
<!--      :value="[]"-->
<!--      :label="$t('infoSec.postProcessing.subcategory')"-->
<!--      :options="[]"-->
<!--      :api-mode="false"-->
<!--    ></multiselect>-->
    <cc-textarea
      v-model="description"
      :placeholder="$t('reusable.description')"
    ></cc-textarea>
  </form>
</template>

<script>
  import { mapActions } from 'vuex';
  import CcTextarea from '../../../utils/textarea.vue';
  import Multiselect from '../../../utils/multiselect.vue';

  export default {
    name: 'post-processing-success-form',
    components: {
      CcTextarea,
      Multiselect,
    },

    computed: {
      description: {
        get() {
          return this.$store.state.reporting.description;
        },
        set(value) {
          this.setValue({ prop: 'description', value });
        },
      },
    },

    methods: {
      ...mapActions('reporting', {
        setValue: 'SET_PROPERTY',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/info-section/post-processing/post-processing';
</style>
