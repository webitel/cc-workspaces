<template>
  <form class="processing-form processing-form__success">
    <multiselect
      class="processing-form__category"
      :value="[]"
      :label="'Category'"
      :options="[]"
      :api-mode="false"
    ></multiselect>
    <multiselect
      class="processing-form__subcategory"
      :value="[]"
      :placeholder="'Subcategory'"
      :options="[]"
      :api-mode="false"
    ></multiselect>
    <btn
      class="processing-form__submit"
      @click.native="sendReporting"
    >{{$t('reusable.send')}}
    </btn>
  </form>
</template>

<script>
  import { mapActions } from 'vuex';
  import Btn from '../../../utils/btn.vue';
  import Multiselect from '../../../utils/multiselect.vue';

  export default {
    name: 'post-processing-success-form',
    components: {
      Btn,
      Multiselect,
    },

    methods: {
      ...mapActions('reporting', {
        sendReporting: 'SEND_REPORTING',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/info-section/post-processing/post-processing';
</style>
