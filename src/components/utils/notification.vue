<template>
  <aside class="notifications-wrap">
    <div class="notification"
         v-for="(message, key) in messages"
         :key="key"
         @click="close(message)"
    >
      <icon v-if="message.info">
        <svg class="icon icon-rounded-tick-md md">
          <use xlink:href="#icon-rounded-tick-md"></use>
        </svg>
      </icon>
      <icon v-if="message.error">
        <svg class="icon icon-attention-md md">
          <use xlink:href="#icon-attention-md"></use>
        </svg>
      </icon>
      <div class="notification__text">
        {{message.message}}
      </div>
      <icon @click="close(message)">
        <svg class="icon icon-close-md md">
          <use xlink:href="#icon-close-md"></use>
        </svg>
      </icon>
    </div>
  </aside>
</template>

<script>
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';

export default {
    name: 'notification',
    data() {
      return {
        messages: [],
      };
    },
    mounted() {
      eventBus.$on('notificationInfo', (info) => {
        this.showInfo(info);
      });
      eventBus.$on('notificationError', (error) => {
        this.showError(error);
      });
    },
    methods: {
      showInfo(message) {
        this.messages.unshift({ message, info: true });
        setTimeout(() => {
          this.close(message);
        }, 4000);
      },
      showError(message) {
        this.messages.unshift({ message, error: true });
        setTimeout(() => {
          this.close(message);
        }, 4000);
      },
      close(message) {
        this.messages.splice(this.findMessageInArray(message), 1);
      },
      findMessageInArray(message) {
        return this.messages.findIndex((item) => item.message === message);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../css/styleguide/notification';

  .icon-rounded-tick-md {
    stroke: $true-color;
    fill: $true-color;
  }

  .icon-attention-md {
    stroke: $false-color;
    fill: $false-color;
  }
</style>
