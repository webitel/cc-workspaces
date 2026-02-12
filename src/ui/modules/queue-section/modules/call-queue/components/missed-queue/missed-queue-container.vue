<template>
  <task-queue-container
    :empty="!missedList.length"
  >
    <div v-for="(task, key) of missedList" class="missed-queue-container">
      <missed-preview
        :key="task.id"
        :task="task"
        :index="key"
        :size="size"
        @hide="hideMissed(task)"
        @call="redial(task)"
      />
      <wt-divider v-if="missedList.length > key + 1"/>
    </div>
    <load-more-button v-show="next" :load-more="loadMore" />
  </task-queue-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import LoadMoreButton from '../../../../../../_shared/components/load-more-button.vue';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import MissedPreview from './missed-queue-preview.vue';

export default {
	name: 'MissedQueueContainer',
	components: {
		LoadMoreButton,
		TaskQueueContainer,
		MissedPreview,
	},
	mixins: [
		sizeMixin,
	],

	computed: {
		...mapState('features/call/missed', {
			missedList: (state) => state.missedList,
			next: (state) => state.next,
		}),
	},

	methods: {
		...mapActions('features/call/missed', {
			initializeMissed: 'INITIALIZE_MISSED',
			loadMore: 'LOAD_NEXT_PAGE',
			redial: 'REDIAL',
			hideMissed: 'HIDE_MISSED',
		}),
	},

	created() {
		this.initializeMissed();
	},
};
</script>

<style lang="scss" scoped>
  .missed-queue-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
