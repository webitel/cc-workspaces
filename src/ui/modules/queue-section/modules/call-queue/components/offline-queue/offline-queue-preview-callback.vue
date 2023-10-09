<template>
  <!--@click.stop needed to prevent click on queue-preview that opens TheAgentWorkspaceSection, we don't need it-->
  <div
    class="queue-preview--offline-queue__callback-container"
    @click.stop
  >
    <!-- If there's only one communication, show a single call button -->
    <template v-if="task.communications.length === 1">
      <wt-rounded-action
        :size="size"
        color="success"
        icon="call--filled"
        rounded
        @click.stop="call(task.id, task.communications[0].id)"
      ></wt-rounded-action>
    </template>
    <!-- If there are multiple communications, show a context menu with call options -->
    <template v-else>
      <wt-context-menu
        :options="options"
        max-width="300px"
      >
        <template v-slot:activator>
          <wt-rounded-action
            :size="size"
            color="success"
            icon="call--filled"
            rounded
          ></wt-rounded-action>
        </template>
        <template v-slot:option="{ text, communicationId }">
          <div
            class="queue-preview--offline-queue__callback-button"
            @click="call(task.id, communicationId)"
          ><span>{{ text }}</span>
          </div>
        </template>
      </wt-context-menu>
    </template>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'offline-queue-preview-callback',
  props: {
    task: {
      required: true,
      type: Object,
    },
    size: {
      type: String,
      required: true,
    },
  },
  computed: {
    options() {
      return this.task.communications.map((el) => ({
        text: el.destination,
        communicationId: el.id,
      }));
    },
  },
  methods: {
    ...mapActions('features/member', {
      makeCall: 'CALL',
    }),
    call(id, communicationId) {
      return this.makeCall({ id, communicationId });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
