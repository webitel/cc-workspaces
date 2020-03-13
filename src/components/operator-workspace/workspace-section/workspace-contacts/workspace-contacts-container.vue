<template>
  <div class="ws-worksection">
    <search v-model="search"></search>
    <div class="ws-worksection__list">
      <div>
        <div class="ws-worksection__list-separator">A</div>
        <contact></contact>
        <contact></contact>
      </div>
      <div>
        <div class="ws-worksection__list-separator">B</div>
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
  .ws-contact-item {
    cursor: pointer;
    &:hover {
      background: $page-bg-color;
    }
  }
</style>
