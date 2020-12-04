<template>
  <div
    class="checkbox-label"
    @click.prevent.stop="input"
  >
    <input
      type="checkbox"
      :checked="value"
    >
    <span class="checkbox"></span>
    <label class="label">{{computeLabel}}</label>
  </div>
</template>

<script>
  export default {
    name: 'table-checkbox',
    props: {
      value: {
        type: Boolean,
        required: true,
      },
      // may be a string, or object with true/false values
      label: {},
    },
    methods: {
      input() {
        // =============================== ATTENTION!!!!!====================================
        // WE PASS INVERTED CHECKBOX VALUE
        // BECAUSE CLICK EVENT FIRES BEFORE CHECKBOX CHANGE
        this.$emit('input', !this.value);
      },
    },
    computed: {
      computeLabel() {
        if (this.label) {
          return this.label[this.value] || this.label;
        }
        return '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  $checkbox-color: rgba(0, 0, 0, 0.3);
  $checkbox-color__checked: #000;

  .checkbox-label {
    display: flex;
    align-items: center;
    position: relative;
    height: 24px;
    padding-left: 24px;
    line-height: 24px;
    cursor: pointer;
    user-select: none;

    .label {
      margin-bottom: 0;
    }

    /* Hide the browser's default checkbox */
    input {
      position: absolute;
      width: 0;
      height: 0;
      cursor: pointer;
      opacity: 0;
    }

    /* Create a custom checkbox */
    .checkbox {
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 18px;
      height: 18px;
      background: #fff;
      border: 2px solid $checkbox-color;
      transform: translate(-50%, -50%);
      border-radius: 2px;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkbox:after {
      content: '';
      position: absolute;
      display: none;

      /* Style the checkmark/indicator */
      box-sizing: border-box;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 12px;
      border: solid $checkbox-color__checked;
      border-width: 0 2.5px 2.5px 0;
      transform: translate(-50%, -50%) rotate(45deg);

    }

    input:checked ~ .checkbox {
      border-color: $checkbox-color__checked;
    }

    /* Show the checkmark when checked */
    input:checked ~ .checkbox:after {
      display: block;
    }
  }
</style>
