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
    <cc-textarea
      v-model="description"
      :placeholder="$t('reusable.description')"
    ></cc-textarea>
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
  import CcTextarea from '../../../utils/textarea.vue';
  import Multiselect from '../../../utils/multiselect.vue';

  export default {
    name: 'post-processing-success-form',
    components: {
      Btn,
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
        sendReporting: 'SEND_REPORTING',
        setValue: 'SET_PROPERTY',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../css/agent-workspace/info-section/post-processing/post-processing';
</style>
