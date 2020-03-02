<template>
  <div class="invalid input__details">
    {{computeErrorText}}
  </div>
</template>

<script>
  export default {
    name: 'validation-message',
    props: {
      v: {},
    },
    computed: {
      computeErrorText() {
        if (this.v && this.v.$dirty) {
          if (this.v.required === false) {
            return this.$t('validation.required');
          } if (this.v.numeric === false) {
            return this.$t('validation.numeric');
          } if (this.v.email === false) {
            return this.$t('validation.email');
          }
        }
        return '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  /*
      .input__details {
          @extend .typo-body-md;

          height: 14px;
          margin-top: 8px;
      }
  */
</style>
