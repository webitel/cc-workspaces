<template>
  <div class="numpad-numbers">
    <wt-button
      v-for="(value) of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', '+']"
      :key="value"
      :size="size"
      class="numpad-numbers__num"
      color="secondary"
      outline
      rounded
      @click="input(value)"
    >{{ value }}
    </wt-button>
  </div>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'numpad-numbers',
  mixins: [sizeMixin],
  methods: {
    input(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.numpad-numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: var(--spacing-xs) var(--spacing-sm);
  width: auto;

  :last-child {
    grid-column-start: 2;
  }

  @media screen and (max-height: 900px) {
    grid-gap: var(--spacing-xs);
  }
}
</style>
