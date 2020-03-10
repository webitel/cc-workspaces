<template>
  <footer class="call-footer">
    <rounded-action
      class="call-action secondary"
      :class="{'active': currentTab === 'numpad'}"
      @click.native="$emit('openTab', 'numpad')"
    >
      <icon>
        <svg class="icon icon-numpad-md md">
          <use xlink:href="#icon-numpad-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary"
      @click.native="toggleMute"
    >
      <icon>
        <svg class="icon icon-mic-md md">
          <use xlink:href="#icon-mic-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary"
      @click.native="toggleHold"
    >
      <icon>
        <svg class="icon icon-hold-md md">
          <use xlink:href="#icon-hold-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary"
    >
      <icon>
        <svg class="icon icon-rec-md md">
          <use xlink:href="#icon-rec-md"></use>
        </svg>
      </icon>
    </rounded-action>
    <rounded-action
      class="call-action secondary"
    >
      <icon>
        <svg class="icon icon-note-md md">
          <use xlink:href="#icon-note-md"></use>
        </svg>
      </icon>
    </rounded-action>
  </footer>
</template>

<script>
  import { mapActions } from 'vuex';
  import RoundedAction from '../../../utils/rounded-action.vue';

  export default {
    name: 'call-footer',
    components: {
      RoundedAction,
    },

    props: {
      currentTab: {
        type: String,
      },
    },

    methods: {
      ...mapActions('operator', {
        toggleMute: 'TOGGLE_MUTE',
        toggleHold: 'TOGGLE_HOLD',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .call-footer {
    display: flex;
    justify-content: space-evenly;
    padding: calcRem(10px) 0;
    margin: 0 calcRem(20px);
  }
</style>
