<template>
  <lookup-item no-before>
    <template #title>
      {{ displayName }}
    </template>

    <template #subtitle>
      {{ displayNumber }}
    </template>

    <template #info-title>
      {{ startTime }}
    </template>

    <template #after>
      <wt-rounded-action
        icon="call-add-to"
        color="secondary"
        rounded
        @click="handleInput"
      ></wt-rounded-action>
    </template>
  </lookup-item>
</template>

<script>
import callTimer from '../../../../../../mixins/callTimerMixin';
import displayInfo from '../../../../../../mixins/displayInfoMixin';
import lookupItemMixin from './mixins/lookupItemMixin';

export default {
  name: 'MergeLookupItem',
  mixins: [callTimer, displayInfo, lookupItemMixin],
  computed: {
    // for mixins
    task() {
      return this.item;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
