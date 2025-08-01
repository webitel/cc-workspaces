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
        :loading="showLoader"
        rounded
        @click.stop="call(task.id, task.communications[0].id)"
      />
    </template>
    <!-- If there are multiple communications, show a context menu with call options -->
    <template v-else>
      <wt-context-menu
        :options="options"
        max-width="300px"
      >
        <template #activator="{ toggle }">
          <wt-rounded-action
            :size="size"
            color="success"
            icon="call--filled"
            :loading="showLoader"
            rounded
            @click="toggle"
          />
        </template>
        <template #option="{ text, communicationId }">
          <div
            class="queue-preview--offline-queue__callback-button"
            @click="call(task.id, communicationId)"
          >
            <span>{{ text }}</span>
          </div>
        </template>
      </wt-context-menu>
    </template>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'OfflineQueuePreviewCallback',
  props: {
    task: {
      required: true,
      type: Object,
    },
    size: {
      type: String,
      required: true,
    },
    loader: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      showLoader: false,
    }
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
      if(this.showLoader) return;

      this.showLoader = true;
      this.makeCall({ id, communicationId });
      this.showLoader = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
