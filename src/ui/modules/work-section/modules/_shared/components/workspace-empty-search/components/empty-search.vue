<template>
  <div class="empty-search">
    <img
      class="empty-search__pic"
      :src="emptySearchPic"
      alt="no results pic">
    <h2 class="empty-search__heading">{{$t('emptySearch.heading')}}</h2>
    <p class="empty-search__text">{{$t('emptySearch.text')}}</p>
  </div>
</template>

<script>
  import emptyContactsPic
    from '../../../assets/empty-search/empty-search-contacts.svg';
  import emptyHistoryPic
    from '../../../assets/empty-search/empty-search-history.svg';

  export default {
    name: 'EmptySearch',
    props: {
      type: {
        type: String,
        required: true,
      },
    },

    computed: {
      emptySearchPic() {
        switch (this.type) {
          case 'contacts':
            return emptyContactsPic;
          case 'history':
            return emptyHistoryPic;
          default:
            return '';
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.empty-search {
    text-align: center;
    max-width: 75%;
  }

  .empty-search__pic {
    width: 130px;
    height: 130px;
    margin: auto auto var(--spacing-sm);
  }

  .empty-search__heading {
    @extend %typo-subtitle-1;
    margin-bottom: var(--spacing-2xs);
  }

  .empty-search__text {
    @extend %typo-caption;
  }
</style>
