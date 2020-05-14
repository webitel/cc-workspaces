<template>
  <div class="user-preferences" v-clickaway="close">
    <button
      class="icon-btn user-preferences__account"
      @click.prevent="showUserActions = !showUserActions"
      v-clickaway="close"
    >
      <icon>
        <svg class="icon md">
          <use xlink:href="#icon-account-md"></use>
        </svg>
      </icon>
    </button>
    <ul
      class="user-preferences__actions-wrap"
      v-show="showUserActions"
    >
      <li class="user-preferences__action user-preferences__action__docs">
        <!--        <i class="icon-icon_doc"></i>-->
        <a
          class="user-preferences__action__text"
          href="https://docs.webitel.com/display/WEP/Webitel+Elastic+Platform"
          target="_blank"
          @click="close"
        >
          {{$t('header.docs')}}
        </a>
      </li>
      <li class="user-preferences__action user-preferences__action__logout">
        <!--        <i class="icon-icon_logout"></i>-->
        <span class="user-preferences__action__text" @click="logoutUser">
          {{$t('reusable.logout')}}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  import clickaway from '../../directives/clickaway';
  import { logout } from '../../api/auth/auth';

  export default {
    name: 'user-preferences',
    directives: { clickaway },
    data: () => ({
      showUserActions: false,
    }),

    methods: {
      settings() {
      },

      logoutUser() {
        this.close();
        logout();
      },

      close() {
        this.showUserActions = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .user-preferences {
    position: relative;
    display: flex;
    align-items: center;
  }

  .user-preferences__account {
    margin-left: calcVH(30px);
    cursor: pointer;
  }

  .user-preferences__actions-wrap {
    @extend .typo-body-md;
    @extend .box-shadow;
    position: absolute;
    top: calcVH(24px);
    right: 0;
    min-width: calcVH(120px);
    margin-top: calcVH(8px);
    color: #000;
    background: #fff;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    z-index: 100;

    .user-preferences__action {
      display: flex;
      align-items: center;
      transition: $transition;
      cursor: pointer;

      .user-preferences__action__text {
        @extend .typo-body-sm;
        display: block;
        width: 100%;
        padding: calcVH(11px) calcVH(13px);
        margin-left: calcVH(8px);
      }

      &__logout {
        color: $false-color;
      }

      &:hover {
        background: $page-bg-color;
      }
    }
  }
</style>
