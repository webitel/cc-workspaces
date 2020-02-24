<template>
  <div class="ws-contacts-container">
    <form class="search-wrap">
      <input class="search" type="text">
    </form>
    <div class="ws-contacts-wrap">
      <div class="ws-contacts-letter-wrap">
        <div class="ws-contact-letter">A</div>
        <contact
          :class="{'selected': true}"
          @click.native="select"
        ></contact>
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
  import Contact from '../workspace-contacts/workspace-contact.vue';

  export default {
    name: 'workspace-transfer-container',
    components: {
      Contact,
    },

    methods: {
      select() {
        this.$emit('select', { extension: '778' });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .selected {
    border: 1px solid #ef6119;
  }
</style>
