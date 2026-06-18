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
import { watch } from 'vue';
import { mapActions, mapState, useStore } from 'vuex';

import { useWebSocketClient } from '../../../../../../../app/api/agent-workspace/websocket/useWebSocketClient';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import { WebSocketConnectionState } from '../../../../../../../ui/enums/WebSocketConnectionState.enum';
import LoadMoreButton from '../../../../../../_shared/components/load-more-button.vue';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import MissedPreview from './missed-queue-preview.vue';

const { state } = useWebSocketClient();

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
		wsConnectionState() {
			return state.value;
		},
	},

	methods: {
		...mapActions('features/call/missed', {
			initializeMissed: 'INITIALIZE_MISSED',
			loadMore: 'LOAD_NEXT_PAGE',
			redial: 'REDIAL',
			hideMissed: 'HIDE_MISSED',
		}),
	},

	watch: {
		wsConnectionState: {
			handler(s) {
				if (s === WebSocketConnectionState.Connected) {
					this.initializeMissed();
				}
			},
			once: true,
		},
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
