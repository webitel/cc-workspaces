<template>
  <popup class="break-popup">
    <template slot="popup-header">
      <h1 class="popup__title">
        <span class="popup-indicator__break"></span>
        Reason for break
      </h1>
    </template>
    <template slot="popup-main">
      <ul class="break-popup__options">
        <li
          class="break-popup__options__item"
          :class="{'selected': option === selected}"
          v-for="(option, key) of breakOptions"
          :key="key"
          @click="selected = option"
        >{{option}}
        </li>
      </ul>
      <cc-textarea
        class="break-popup__textarea"
        :class="{'selected': selected === 'TEXTAREA'}"
        v-model="userOption"
        @focus="selected = 'TEXTAREA'"
      ></cc-textarea>
    </template>
    <template slot="popup-footer">
      <div class="popup-actions">
        <btn
          class="popup-action uppercase"
          @click.native="setBreak"
        >
          Send
        </btn>
        <btn
          class="popup-action uppercase secondary"
          @click.native="$emit('close')"
        >
          Cancel
        </btn>
      </div>
    </template>
  </popup>
</template>

<script>
  import { mapActions } from 'vuex';
  import Btn from '../utils/btn.vue';
  import CcTextarea from '../utils/textarea.vue';
  import Popup from '../utils/popup-container.vue';

  export default {
    name: 'break-popup',
    components: {
      Btn,
      CcTextarea,
      Popup,
    },

    data: () => ({
      selected: '',
      userOption: '',
      breakOptions: [
        'Coffee break', 'Smoke break', 'Restroom', 'Dinner', 'Meeting',
        'Coffee break', 'Smoke break', 'Restroom', 'Dinner', 'Meeting',
        'Coffee break', 'Smoke break', 'Restroom', 'Dinner', 'Meeting',
      ],
    }),

    methods: {
      setBreak() {
        const note = this.selected || this.userOption;
        this.setAgentPause(note);
        this.$emit('close');
      },

      ...mapActions('status', {
        setAgentPause: 'SET_AGENT_PAUSE_STATUS',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  $option-border-color: #F2F2F2;

  .popup__title {
    @extend .typo-heading-lg;
    text-align: center;
  }

  .break-popup__options {
    @extend .cc-scrollbar;
    max-height: calcVH(315px);
    overflow-y: scroll;

    &__item {
      @extend .typo-body-md;
      padding: calcVH(17px) calcVH(14px);
      margin-bottom: calcVH(10px);
      margin-right: calcVH(10px);
      border: 1px solid $option-border-color;
      border-radius: $border-radius;
      transition: $transition;
      cursor: pointer;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover, &.selected {
        border-color: $accent-color;
      }
    }
  }

  .break-popup__textarea {
    height: calcVH(109px);
    margin-top: calcVH(10px);
    border: 1px solid $option-border-color;

    &:hover, &.selected {
      border-color: $accent-color;
    }
  }

  .popup-indicator__break {
    display: inline-block;
    width: calcVH(14px);
    height: calcVH(14px);
    margin-right: calcVH(11px);
    border-radius: 50%;
    background: $break-color;
  }

  .popup-action {
    min-width: calcVH(114px);

    &.secondary {
      margin-left: calcVH(30px);
    }
  }
</style>
