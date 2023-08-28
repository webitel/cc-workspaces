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
        @click.stop="call(task.communications[0].destination)"
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
        <template v-slot:option="{ text }">
          <!-- Clicking an option makes a call -->
          <div
            class="queue-preview--offline-queue__callback-button"
            @click="call(text)"
          ><span>{{ text }}</span>
          </div>
        </template>
      </wt-context-menu>
    </template>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'offline-queue-preview-callback',
  props: {
    task: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapState({
      client: (state) => state.client,
      config: (state) => state.config,
    }),
    options() {
      return this.task.communications.map((el) => ({
        text: el.destination,
      }));
    },
  },
  methods: {
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
    call(number) {
      return this.makeCall({ number });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
