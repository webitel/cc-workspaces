<template>
  <form class="timepicker">
    <div class="timepicker__input-wrap">
      <input
        class="input__short timepicker__input"
        :value="computeHour"
        @input="setHour($event.target.value)"
        type="number"
        min="0"
      >
    </div>
    <span class="timepicker__delimiter">:</span>
    <div class="timepicker__input-wrap">
      <multiselect
        class="timepicker__select text-center"
        v-if="minSelect"
        :value="computeMin"
        :options="minOptions"
        :api-mode="false"
        :track-by="'value'"
        @input="setMin($event.value)"
      ></multiselect>
      <input
        v-else
        class="input__short timepicker__input"
        :value="computeMin"
        @input="setMin($event.target.value)"
        type="number"
      >
    </div>
  </form>
</template>

<script>
  import Multiselect from './multiselect.vue';

  export default {
    name: 'timepicker',
    components: {
      Multiselect,
    },

    props: {
      value: {
        type: Number,
        required: true,
      },
      // inputs type like text or number
      type: {
        type: String,
        default: 'number',
      },
      minSelect: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      minOptions: [
        {
          name: '00',
          value: 0,
        },
        {
          name: '15',
          value: 15,
        },
        {
          name: '30',
          value: 30,
        },
        {
          name: '45',
          value: 45,
        },
      ],
    }),

    computed: {
      computeHour() {
        return new Date(this.value).getHours();
      },
      computeMin() {
        const min = new Date(this.value).getMinutes();
        if (this.minSelect) {
          return this.minOptions.find((opt) => opt.value === min) || {
            value: min,
            name: `${min}`,
          };
        }
        return min;
      },
    },

    methods: {
      setHour(value) {
        const newValue = new Date(this.value).setHours(value);
        this.$emit('input', newValue);
      },
      setMin(value) {
        const newValue = new Date(this.value).setMinutes(value);
        this.$emit('input', newValue);
      },
    },
  };
</script>

<style lang="scss" scoped>
  $label-color: #ACACAC;
  $border-color: #E6E6E6;

  .timepicker {
    display: flex;
    width: fit-content;
    width: -moz-fit-content;
    align-items: center;
  }

  .timepicker__input-wrap {
    display: flex;
    flex-direction: column;
  }

  .timepicker__input, .timepicker__select {
    min-width: (80px);
  }

  .timepicker__delimiter {
    display: inline-block;
    margin: 0 (10px);
  }
</style>
