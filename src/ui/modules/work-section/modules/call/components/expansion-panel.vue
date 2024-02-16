<template>
  <div>
    <div>
      <slot name="header" v-bind="{ isExpanded }"></slot>
    </div>
    <wt-expand-transition>
      <section
        v-if="isExpanded"
      >
        <slot name="content"></slot>
      </section>
    </wt-expand-transition>
  </div>
</template>

<script>
import WtExpandTransition from '@webitel/ui-sdk/src/components/transitions/wt-expand-transition.vue';

export default {
  name: 'call-window-wrapper',
  components: { WtExpandTransition },
  data: () => ({
  }),
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>

</style>
