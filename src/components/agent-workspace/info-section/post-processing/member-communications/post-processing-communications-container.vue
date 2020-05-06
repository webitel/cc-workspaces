<template>
  <div class="processing-communications-container">
    <communication
      :selected="selected"
      @select="selected = $event"
    ></communication>
    <communication
      :selected="selected"
      @select="selected = $event"
      :disabled="false"
    ></communication>
    <div class="processing-communications-container__add-new">
      <button class="icon-btn">
        <icon>
          <svg class="icon icon-call-ringing-md md">
            <use xlink:href="#icon-call-ringing-md"></use>
          </svg>
        </icon>
      </button>
      <span class="processing-communications-container__add-new__text">
        {{$t('infoSec.postProcessing.addNewCommunication')}}</span>
    </div>
  </div>
</template>

<script>
  import Communication from './post-processing-communication.vue';

  export default {
    name: 'post-processing-communications-container',
    components: {
      Communication,
    },
    data: () => ({
      selected: '',
    }),
  };
</script>

<style lang="scss" scoped>
  .processing-communications-container {
    margin-top: calcVH(40px);

    &__add-new {
      display: flex;
      align-items: center;
      margin-top: calcVH(30px);

      &__text {
        @extend .typo-body-sm;
        margin-left: calcVH(30px);
      }
    }
  }
</style>
