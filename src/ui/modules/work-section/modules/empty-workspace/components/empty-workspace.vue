<template>
  <section class="empty-workspace">
    <component :is="`${type}-ws`"></component>
  </section>
</template>

<script>
import EmptyWs from './empty-workspace-empty.vue';
import TransferWs from './empty-workspace-transfer.vue';

export default {
	name: 'EmptyWorkspace',
	components: {
		EmptyWs,
		TransferWs,
	},
	props: {
		type: {
			type: String,
			default: 'empty',
		},
	},
};
</script>

<style lang="scss" scoped>
  @import '../css/empty-workspace';
</style>
