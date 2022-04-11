<template>
  <div class="numpad-numbers">
    <wt-button
      v-for="(value) of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']"
      :key="value"
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
export default {
  name: 'numpad-numbers',
  methods: {
    input(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
$numpad-color: #808080;

.numpad-numbers {
  display: grid;
  margin: auto;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: var(--spacing-sm);

  @media screen and (max-height: 900px) {
    grid-gap: var(--spacing-xs);
  }
}
</style>
