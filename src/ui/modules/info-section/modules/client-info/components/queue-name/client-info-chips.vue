<template>
  <article v-if="queueName" class="client-info-chips">
    <queue-name-chip :name="queueName"/>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

import { getQueueName } from '../../../../../queue-section/modules/_shared/scripts/getQueueName';
import QueueNameChip from '../../../../../work-section/modules/_shared/components/queue-name-chip/queue-name-chip.vue';

export default {
	name: 'ClientInfoChips',
	components: {
		QueueNameChip,
	},
	computed: {
		...mapGetters('workspace', {
			taskOnWorkspace: 'TASK_ON_WORKSPACE',
		}),
		queueName() {
			return getQueueName(this.taskOnWorkspace);
		},
	},
};
</script>

<style lang="scss" scoped>
.client-info-chips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}
</style>
