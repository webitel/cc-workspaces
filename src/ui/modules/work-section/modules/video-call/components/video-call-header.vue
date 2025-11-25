<template>
  <task-header :size="size">
    <template #before-avatar>
      <wt-rounded-action
        class="call-action"
        :active="isOnHistory"
        :size="size"
        icon="history"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', VideoCallTab.History)"
      ></wt-rounded-action>
      <wt-rounded-action
        class="call-action"
        :active="isOnContacts"
        :size="size"
        icon="contacts"
        color="secondary"
        rounded
        wide
        @click="$emit('openTab', VideoCallTab.Contacts)"
      ></wt-rounded-action>
    </template>
    <template #after-avatar>
      <wt-rounded-action
        v-if="isHangup"
        class="call-action"
        :size="size"
        icon="call-end--filled"
        color="error"
        rounded
        wide
        @click="hangup"
      ></wt-rounded-action>
    </template>
    <template #title>
      {{ displayName }}
    </template>
    <template #subtitle>
      {{ displayNumber }}
    </template>
  </task-header>
</template>

<script>
  import { mapActions, mapGetters,mapState } from 'vuex';

  import sizeMixin from '../../../../../../app/mixins/sizeMixin';
  import displayInfoMixin from '../../../../../mixins/displayInfoMixin';
  import TaskHeader from '../../_shared/components/task-header/task-header.vue';
  import { VideoCallTab } from '../enums/VideoCallTab.enum';

  export default {
    name: 'CallHeader',
    components: { TaskHeader },
    mixins: [displayInfoMixin, sizeMixin],
    props: {
      currentTab: {
        type: String,
      },
    },

    data: () => ({
      // Made CallTab available in template (required for Options API)
      VideoCallTab: VideoCallTab,
    }),

    computed: {
      ...mapState('features/call', {
        callList: (state) => state.callList,
      }),
      ...mapGetters('features/call', {
        call: 'CALL_ON_WORKSPACE',
        isNewCall: 'IS_NEW_CALL',
      }),

      isOnContacts() {
        return this.currentTab === VideoCallTab.Contacts;
      },

      isOnHistory() {
        return this.currentTab === VideoCallTab.History;
      },


      isHangup() {
        return this.call.allowHangup;
      },

      isCall() {
        return this.isNewCall && this.call.newNumber;
      },
    },

    methods: {
      ...mapActions('features/call', {
        makeCall: 'CALL',
        hangup: 'HANGUP',
      }),
    },
  };
</script>

<style lang="scss" scoped>
</style>
