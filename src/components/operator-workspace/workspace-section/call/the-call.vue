<template>
    <section class="call">
        <call-preview v-if="false"></call-preview>
        <active-call></active-call>
    </section>
</template>

<script>
  import CallPreview from './call-preview.vue';
  import ActiveCall from './active-call.vue';

  export default {
    name: 'the-call',
    components: {
      CallPreview,
      ActiveCall,
    },
  };
</script>

<style lang="scss" scoped>
 .call {
   height: 100%;
 }
</style>
