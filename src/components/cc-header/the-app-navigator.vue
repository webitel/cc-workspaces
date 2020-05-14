<template>
  <div class="app-navigator">
    <button
      class="icon-btn app-navigator__btn"
      :class="{'opened': isOpened}"
      @click.prevent="isOpened = !isOpened"
      v-clickaway="close"
    >
      <icon>
        <svg class="icon md">
          <use xlink:href="#icon-app-navigator-md"></use>
        </svg>
      </icon>
    </button>
    <nav
      class="app-navigator__nav-wrapper"
      :class="{'hidden': !isOpened}"
    >
      <h3 class="app-navigator__nav-title">
        {{$t('appNavigator.title')}}
      </h3>
      <ul class="app-navigator__nav">
        <li
          class="app-navigator__card"
          :class="{'active': activeApp === app.name}"
          v-for="(app, key) of apps"
          :key="key"
        >
          <a
            class="app-navigator__card__link"
            :href="app.href"
            :title="app.title"
            target="_blank"
          >
            <img class="app-navigator__card__img" :src="app.img" :alt="`${app.name}-pic`">
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  import clickaway from '../../directives/clickaway';

  const imgAdmin = require('../../assets/app-navigator/app-admin.svg');
  const imgAgent = require('../../assets/app-navigator/app-agent.svg');
  const imgAudit = require('../../assets/app-navigator/app-audit.svg');
  const imgHistory = require('../../assets/app-navigator/app-history.svg');
  const imgSupervisor = require('../../assets/app-navigator/app-supervisor.svg');

  const CURRENT_APP = 'agent';

  export default {
    name: 'the-app-navigator',
    directives: {
      clickaway,
    },
    data: () => ({
      isOpened: false,
      activeApp: CURRENT_APP,
    }),

    computed: {
      apps() {
        return [
          {
            name: 'agent',
            title: this.$t('appNavigator.agent'),
            href: process.env.VUE_APP_AGENT_URL,
            img: imgAgent,
          },
          {
            name: 'supervisor',
            title: this.$t('appNavigator.supervisor'),
            href: process.env.VUE_APP_SUPERVISOR_URL,
            img: imgSupervisor,
          },
          {
            name: 'history',
            title: this.$t('appNavigator.history'),
            href: process.env.VUE_APP_HISTORY_URL,
            img: imgHistory,
          },
          {
            name: 'audit',
            title: this.$t('appNavigator.audit'),
            href: process.env.VUE_APP_AUDIT_URL,
            img: imgAudit,
          },
          {
            name: 'admin',
            title: this.$t('appNavigator.admin'),
            href: process.env.VUE_APP_ADMIN_URL,
            img: imgAdmin,
          },
        ];
      },
    },

    methods: {
      close() {
        this.isOpened = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  $app-navigator-gap: calcVH(30px);
  $app-navigator-shadow: 0px calcVH(8px) calcVH(18px) rgba(0, 0, 0, 0.08);
  $app-navigator-border-color: #eaeaea;
  $app-navigator-border-color--hover: $accent-color;


  // helper class
  .typo-app-navigator {
    font-family: 'Montserrat Regular', monospace;
    font-size: calcVH(14px);
    line-height: calcVH(20px);
  }

  .app-navigator {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: calcVH(30px);
    z-index: 90;
  }

  // dropdown part
  .app-navigator__nav-wrapper {
    @extend .cc-scrollbar;
    position: absolute;
    top: calc(100% + 5px); // icon + 5px
    right: 0;
    max-height: 80vh;
    padding: $app-navigator-gap;
    background: #fff;
    border-radius: $border-radius;
    box-shadow: $app-navigator-shadow;
    transition: $transition;
    overflow: auto;
  }

  .app-navigator__nav-title {
    @extend .typo-app-navigator;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: $app-navigator-gap;
  }

  // ul with li apps
  .app-navigator__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: $app-navigator-gap;
  }

  .app-navigator__card {
    width: calcVH(120px);
    height: calcVH(120px);
    box-sizing: border-box;
    border: 1px solid $app-navigator-border-color;
    border-radius: $border-radius;
    transition: $transition;

    &.active, &:hover {
      border-color: $app-navigator-border-color--hover;
    }
  }

  // a tag
  .app-navigator__card__link {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  // img inside a
  .app-navigator__card__img {
    width: 100%;
    height: 100%;
  }
</style>
