<template>
  <lookup-item-container>
    <template v-slot:search>
      <div></div>
    </template>
    <template v-slot:content>
      <ul>
        <li
          class="member-communications__item"
          :class="{'selected': communication.id === selectedCommId}"
          v-for="(communication) of communications"
          :key="communication.id"
          @click="selectCommunication(communication)"
        >
          <div class="member-communications__type">{{ communication.type.name }}</div>
          <div class="member-communications__destination">{{ communication.destination }}</div>
        </li>
      </ul>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import LookupItemContainer from '../../_shared/components/lookup-item-container/lookup-item-container.vue';

export default {
  name: 'member-communications',
  components: { LookupItemContainer },

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
.member-communications {
  &__item {
    padding: var(--spacing-xs) var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    transition: var(--transition);
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover,
    &.selected {
      border-color: var(--primary-color);
    }
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
