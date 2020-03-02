<template>
  <aside class="notifications-wrap">
    <div class="notification"
         v-for="(message, key) in messages"
         :key="key"
         @click="close(message.info || message.error)"
    >
      <i v-if="message.info"></i>
      <i v-if="message.error"></i>
      <div class="notification__text">
        {{message.info || message.error}}
      </div>
      <i @click="close(message.info || message.error)"></i>
    </div>
  </aside>
</template>

<script>
  import eventBus from '../../utils/eventBus';

  export default {
    name: 'notification',
    data() {
      return {
        messages: [{
          info: 'Info text',
        }, {
          error: 'Err text',
        }],
      };
    },
    mounted() {
      eventBus.$on('notificationInfo', (info) => { this.showInfo(info); });
      eventBus.$on('notificationError', (error) => { this.showError(error); });
    },
    methods: {
      showInfo(message) {
        this.messages.unshift({ message });
        setTimeout(() => {
          this.close(message);
        }, 4000);
      },

      showError(message) {
        this.messages.unshift({ message });
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
</style>
