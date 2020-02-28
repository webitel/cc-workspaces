<template>
  <div class="ws-contacts-container">
    <form class="search-wrap">
      <input class="search" type="text">
    </form>
    <div class="ws-contacts-wrap">
      <div class="ws-contacts-letter-wrap">
        <div class="ws-contact-letter">A</div>
        <contact></contact>
        <contact></contact>
      </div>
      <div class="ws-contacts-letter-wrap">
        <div class="ws-contact-letter">A</div>
        <contact></contact>
        <contact></contact>
      </div>
    </div>
  </div>
</template>

<script>
  import Contact from './workspace-contact.vue';

  export default {
    name: 'workspace-contacts-container',
    components: {
      Contact,
    },
  };
</script>

<style scoped>

</style>
