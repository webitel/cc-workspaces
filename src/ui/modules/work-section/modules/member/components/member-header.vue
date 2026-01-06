<template>
  <task-header :size="size">
    <template #before-avatar>
      <wt-rounded-action
        :active="isOnHistory"
        :size="size"
        class="call-action"
        color="secondary"
        icon="history"
        rounded
        wide
        @click="$emit('openTab', 'history')"
      ></wt-rounded-action>
    </template>
    <template #after-avatar>
      <wt-rounded-action
        v-show="isCall"
        :size="size"
        color="success"
        icon="call-ringing"
        rounded
        wide
        @click="makeCall"
      ></wt-rounded-action>
    </template>
    <template #title>{{ member.name }}</template>
    <template v-if="queueName" #queue>
      <wt-chip color="secondary">
        {{ queueName }}
      </wt-chip>
    </template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';

export default {
  name: 'WorkspaceMemberHeader',
  components: { TaskHeader },
  mixins: [sizeMixin],
  props: {
    currentTab: {
      type: String,
    },
  },
  computed: {
    ...mapGetters('features/member', {
      member: 'MEMBER_ON_WORKSPACE',
    }),
    ...mapGetters('features/member', {
      isCommSelected: 'IS_COMMUNICATION_SELECTED',
    }),

    isOnHistory() {
      return this.currentTab === 'history';
    },

    isCall() {
      return this.isCommSelected;
    },
    queueName() {
      return getQueueName(this.member);
    },
  },

  methods: {
    ...mapActions('features/member', {
      makeCall: 'CALL',
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
