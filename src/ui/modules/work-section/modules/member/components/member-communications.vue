<template>
  <lookup-item-container>
    <template #search>
      <div></div>
    </template>
    <template #content>
      <ul>
        <li
          v-for="(communication) of communications"
          :key="communication.id"
          class="member-communications__item"
          :class="{'selected': communication.id === selectedCommId}"
          @click="selectCommunication(communication)"
        >
          <div class="member-communications__type typo-subtitle-1">{{ communication.type.name }}</div>
          <div class="member-communications__destination typo-caption">{{ communication.destination }}</div>
        </li>
      </ul>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import LookupItemContainer from '../../_shared/components/lookup-item-container/lookup-item-container.vue';

export default {
	name: 'MemberCommunications',
	components: {
		LookupItemContainer,
	},

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
@use '@webitel/ui-sdk/src/css/main' as *;

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
    margin-bottom: 6px;
  }
}


</style>
