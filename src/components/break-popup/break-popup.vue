<template>
  <wt-popup class="break-popup" @close="close">
    <template slot="title">
      <div class="break-popup__title-wrapper">
        <span class="popup-indicator__break"></span>
        {{ $t('agentStatus.breakPopup.breakReason') }}
      </div>
    </template>
    <template slot="main">
      <ul class="break-popup__options">
        <li
          class="break-popup__options__item"
          :class="{'selected': option === selected}"
          v-for="(option, key) of breakOptions"
          :key="key"
          @click="selected = option"
        >{{ option }}
        </li>
      </ul>
      <wt-textarea
        class="break-popup__textarea"
        :class="{'selected': selected === 'TEXTAREA'}"
        v-model="userBreakNote"
        :placeholder="$t('agentStatus.breakPopup.breakReason')"
        @focus="selected = 'TEXTAREA'"
      ></wt-textarea>
    </template>
    <template slot="actions">
      <wt-button
        @click="setBreak"
      >{{ $t('reusable.send') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >{{ $t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'break-popup',

  data: () => ({
    selected: '',
    userBreakNote: '',
  }),

  computed: {
    breakOptions() {
      return [
        this.$t('agentStatus.breakPopup.commons.coffeeBreak'),
        this.$t('agentStatus.breakPopup.commons.smokeBreak'),
        this.$t('agentStatus.breakPopup.commons.restroom'),
        this.$t('agentStatus.breakPopup.commons.dinner'),
        this.$t('agentStatus.breakPopup.commons.meeting'),
      ];
    },
  },

  methods: {
    ...mapActions('status', {
      setAgentPause: 'SET_AGENT_PAUSE_STATUS',
    }),

    setBreak() {
      const note = this.selected === 'TEXTAREA' ? this.userBreakNote : this.selected;
      this.setAgentPause(note);
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>

.wt-popup ::v-deep .wt-popup__popup {
  min-width: 500px;
}

.break-popup__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  .popup-indicator__break {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 11px;
    border-radius: 50%;
    background: var(--main-accent-color);
  }
}

.break-popup__options {
  $four-items-height: ((54px+10px)*4); // item height + 10px bottom margin x 4
  @extend %wt-scrollbar;
  max-height: #{$four-items-height};
  overflow-y: scroll;

  &__item {
    @extend .typo-body-md;
    padding: 17px 14px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid var(--form-border-color);
    border-radius: var(--border-radius);
    transition: var(--transition);
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover, &.selected {
      border-color: var(--main-accent-color);
    }
  }
}

.break-popup__textarea {
  height: 109px;
  margin-top: 10px;
  margin-right: 10px + 4px; // 10px like options + 4px scroll width

  &:hover, &.selected  {
    &::v-deep .wt-textarea__wrapper .wt-textarea__textarea {
      border-color: var(--main-accent-color);
    }
  }
}
</style>
