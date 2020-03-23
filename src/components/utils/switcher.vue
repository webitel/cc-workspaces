<template>
    <label class="switcher" :class="{'disabled': disabled}">
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
        name: 'switcher',
        props: {
            value: {
                type: Boolean,
                required: true,
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
</style>
