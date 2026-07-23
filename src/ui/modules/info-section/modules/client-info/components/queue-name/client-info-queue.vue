<template>
  <article v-if="queueName" class="client-info-queue">
    <queue-name-text :name="queueName"/>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

import { getQueueName } from '../../../../../queue-section/modules/_shared/scripts/getQueueName';
import QueueNameText from '../../../../../work-section/modules/_shared/components/queue-name-text/queue-name-text.vue';

export default {
	name: 'ClientInfoQueue',
	components: {
		QueueNameText,
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
.client-info-queue {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}
</style>
