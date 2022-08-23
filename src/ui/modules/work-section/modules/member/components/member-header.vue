<template>
  <task-header>
    <template v-slot:before-avatar>
      <wt-rounded-action
        :active="isOnHistory"
        class="call-action"
        color="secondary"
        icon="history"
        rounded
        wide
        @click="$emit('openTab', 'history')"
      ></wt-rounded-action>
    </template>
    <template v-slot:after-avatar>
      <wt-rounded-action
        :class="{ 'hidden': !isCall }"
        color="success"
        icon="call-ringing"
        rounded
        wide
        @click="makeCall"
      ></wt-rounded-action>
    </template>
    <template v-slot:title>{{ member.name }}</template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';

export default {
  name: 'workspace-member-header',
  components: { TaskHeader },
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
