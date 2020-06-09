<template>
  <nav class="tabs">
    <button
      class="tab"
      :class="{'active': tab.value === currentTab.value}"
      v-for="(tab, key) in tabs"
      :value="tab.text"
      :key="key"
      type="button"
      @click="openTab(tab)"
    >
      <slot :name="tab.value">
        {{tab.text}}
      </slot>
    </button>

    <div class="tabs__underline">
      <div
        class="tab__underline__highlight"
        :style="{ width: `${activeLineWidth}px`,
                transform: `translateX(${activeLineOffset}px)` }"
      ></div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'tabs',
    props: {
      currentTab: {
        type: Object,
        required: true,
      },
      tabs: {
        type: Array,
        required: true,
      },
    },

    model: {
      prop: 'currentTab',
      event: 'change',
    },

    data: () => ({
      activeLineWidth: 0,
      activeLineOffset: 0,
    }),

    methods: {
      openTab(value) {
        this.$emit('change', value);
        this.moveActiveLine(value);
      },

      moveActiveLine(newValue) {
        if (!this.currentTab) return;
        if (!this.$refs || !this.$refs[newValue] || !this.$refs[newValue][0]) return;
        const element = this.$refs[newValue][0];
        this.activeLineWidth = element.clientWidth;
        this.activeLineOffset = element.offsetLeft;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../css/styleguide/tabs';
</style>
