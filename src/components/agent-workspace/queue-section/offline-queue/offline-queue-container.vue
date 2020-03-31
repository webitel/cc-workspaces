<template>
  <section class="call-preview-wrap">
    <!--
          v-for="(call, key) of callList"
          :call="call"
          :index="key"
          :key="key"
          @click.native.prevent="openCall(key)"
    -->
  </section>
</template>

<script>
  export default {
    name: 'offline-queue-container',
  };
</script>

<style scoped>

</style>
