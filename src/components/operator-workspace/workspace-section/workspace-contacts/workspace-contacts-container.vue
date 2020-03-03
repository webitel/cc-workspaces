<template>
  <div class="ws-contacts-container">
    <search v-model="search"></search>
    <div class="ws-contacts-wrap">
      <div class="ws-contacts-letter-wrap">
        <div class="ws-contact-letter">A</div>
        <contact></contact>
        <contact></contact>
      </div>
      <div class="ws-contacts-letter-wrap">
        <div class="ws-contact-letter">B</div>
        <contact></contact>
        <contact></contact>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from '../../../utils/search-input.vue';
  import Contact from './workspace-contact.vue';

  export default {
    name: 'workspace-contacts-container',
    components: {
      Search,
      Contact,
    },

    data: () => ({
      search: '',
    }),
  };
</script>

<style lang="scss" scoped>
</style>
