<template>
  <lookup-item no-before>
    <template v-slot:title>
      {{ displayName }}
    </template>

    <template v-slot:subtitle>
      {{ displayNumber }}
    </template>

    <template v-slot:info-title>
      {{ startTime }}
    </template>

    <template v-slot:after>
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
  name: 'merge-lookup-item',
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
