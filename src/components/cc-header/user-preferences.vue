<template>
  <div class="user-preferences" v-clickaway="close">
    <button
      class="icon-btn user-preferences__account"
      :class="{'opened': isOpened}"
      @click.prevent="isOpened = !isOpened"
      v-clickaway="close"
    >
      <icon>
        <svg class="icon md">
          <use xlink:href="#icon-account-md"></use>
        </svg>
      </icon>
    </button>
    <section class="user-preferences__actions-wrapper" v-show="isOpened">
      <header class="user-preferences__actions-header">
        <h3 class="user-preferences__username">{{name || username}}</h3>
        <p class="user-preferences__account">{{account}}</p>
      </header>
      <ul class="user-preferences__actions">
        <li class="user-preferences__action user-preferences__action__docs">
          <a
            class="user-preferences__action__link"
            href="https://docs.webitel.com/display/WEP/Webitel+Elastic+Platform"
            target="_blank"
            @click="close"
          >
            <icon>
              <svg class="icon sm">
                <use xlink:href="#icon-docs-sm"></use>
              </svg>
            </icon>
            <span>{{$t('header.docs')}}</span>
          </a>
        </li>
        <!--        <li class="user-preferences__action user-preferences__action__settings">-->
        <!--          <a class="user-preferences__action__link" @click.prevent="settings">-->
        <!--            <icon>-->
        <!--              <svg class="icon sm">-->
        <!--                <use xlink:href="#icon-settings-sm"></use>-->
        <!--              </svg>-->
        <!--            </icon>-->
        <!--            <span>-->
        <!--          {{$t('reusable.settings')}}-->
        <!--        </span>-->
        <!--          </a>-->
        <!--        </li>-->
        <li class="user-preferences__action user-preferences__action__logout">
          <a class="user-preferences__action__link" @click.prevent="logoutUser">
            <icon>
              <svg class="icon sm">
                <use xlink:href="#icon-logout-sm"></use>
              </svg>
            </icon>
            <span>
          {{$t('reusable.logout')}}
        </span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import APIRepository from '../../api/APIRepository';

  const authAPI = APIRepository.auth;

  export default {
    name: 'user-preferences',
    data: () => ({
      isOpened: false,
    }),

    computed: {
      ...mapState('userinfo', {
        name: (state) => state.name,
        username: (state) => state.username,
        account: (state) => state.account,
      }),
    },

    methods: {
      settings() {
        const settingsUrl = process.env.VUE_APP_SETTINGS_URL;
        window.open(settingsUrl);
      },

      async logoutUser() {
        try {
          await authAPI.logout();
          await this.$router.replace('/auth');
        } catch {
        } finally {
          this.close();
        }
      },

      close() {
        this.isOpened = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  $user-preferences-gap: (30px);
  $user-preferences-shadow: 0px (8px) (18px) rgba(0, 0, 0, 0.08);

  .typo-user-preferences-title {
    font-family: 'Montserrat Regular', monospace;
    font-size: (14px);
    line-height: (17px);
  }

  .typo-user-preferences-subtitle {
    font-family: 'Montserrat Regular', monospace;
    font-size: (14px);
    line-height: (17px);
  }

  .typo-user-preferences-action {
    font-family: 'Montserrat Regular', monospace;
    font-size: (13px);
    line-height: (16px);
  }

  .user-preferences {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: (30px);
    z-index: 90;
  }

  .user-preferences__actions-wrapper {
    @extend .typo-body-md;
    @extend .box-shadow;
    position: absolute;
    top: calc(100% + 5px); // icon + 5px
    right: 0;
    min-width: (120px);
    background: #fff;
    border-radius: $border-radius;
    box-shadow: $user-preferences-shadow;
    transition: $transition;
  }

  .user-preferences__actions-header {
    padding: $user-preferences-gap $user-preferences-gap (21px);

    .user-preferences__username {
      @extend .typo-user-preferences-title;
    }

    .user-preferences__account {
      @extend .typo-user-preferences-subtitle;
    }
  }

  .user-preferences__action {
    display: flex;

    &:hover {
      background: $page-bg-color;
    }

    .user-preferences__action__link {
      @extend .typo-user-preferences-action;
      display: flex;
      align-items: center;
      width: 100%;
      padding: (11px) $user-preferences-gap;
      cursor: pointer;

      .icon-wrap {
        margin-right: (8px);
      }
    }

    &__logout .user-preferences__action__link {
      color: $false-color;

      .icon {
        fill: $false-color;
        stroke: $false-color;
      }
    }
  }
</style>
