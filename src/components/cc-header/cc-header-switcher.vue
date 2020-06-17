<template>
  <label class="switcher" :class="{'disabled': disabled}">
    <div class="switcher-label" v-if="label">{{label}}</div>
    <input
      type="checkbox"
      :checked="value"
      @change="toggleSwitch"
    >
    <span class="slider"></span>
  </label>
</template>

<script>
  export default {
    name: 'cc-header-switcher',
    props: {
      value: {
        type: Boolean,
        // required: true,
      },
      label: {
        type: String,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      toggleSwitch() {
        this.$emit('input', !this.value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../css/styleguide/switcher";

  .switcher {
    /* overrided default .switcher to fit label before switcher itself */
    display: flex;
    width: auto;
    height: auto;
    align-items: center;

    .slider {
      position: relative;
      width: (40px);
      height: (22px);
    }
  }

  .switcher-label {
    @extend .typo-body-sm;
    margin-right: (10px);
    user-select: none;
  }
</style>
