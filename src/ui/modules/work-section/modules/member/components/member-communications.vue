<template>
  <ul class="ws-worksection__list workspace-member-communications__list">
    <li
      class="workspace-member-communication"
      :class="{'selected': communication.id === selectedCommId}"
      v-for="(communication) of communications"
      :key="communication.id"
      @click="selectCommunication(communication)"
    >
      <div class="workspace-member-communication__type">{{communication.type.name}}</div>
      <div class="workspace-member-communication__destination">{{communication.destination}}</div>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

  export default {
    name: 'member-communications',

    computed: {
      ...mapState('features/member', {
        selectedCommId: (state) => state.selectedCommId,
      }),
      ...mapGetters('features/member', {
        member: 'MEMBER_ON_WORKSPACE',
      }),
      communications() {
        return this.member.communications;
      },
    },

    methods: {
      ...mapActions('features/member', {
        selectCommunication: 'SELECT_COMMUNICATION',
      }),
    },
  };
</script>

<style lang="scss" scoped>

  .workspace-member-communication {
    padding: 10px 20px;
    margin-bottom: 10px;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    transition: var(--transition);
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover,
    &.selected {
      border-color: var(--accent-color);
    }

    &__type {
      @extend %typo-subtitle-1;
      margin-bottom: 6px;
    }

    &__destination {
      @extend %typo-caption;
    }
  }
</style>
