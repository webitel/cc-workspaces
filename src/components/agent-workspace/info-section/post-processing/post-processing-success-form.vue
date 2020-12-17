<template>
  <form class="processing-form processing-form__success">
    <wt-textarea
      :value="description"
      :label="$t('reusable.description')"
      :placeholder="$t('reusable.description')"
      @input="setValue({ prop: 'description', value: $event })"
    ></wt-textarea>
  </form>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'post-processing-success-form',
    computed: {
      ...mapState('reporting', {
        description: (state) => state.description,
      }),
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
