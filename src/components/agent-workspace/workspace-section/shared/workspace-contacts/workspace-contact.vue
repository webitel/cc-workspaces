<template>
  <div class="ws-worksection__item ws-contact-item">

    <div class="ws-worksection__item__pic-wrap">
      <wt-rounded-action
        class="ws-contact-item__call-action"
        :class="{'d-none': !callable}"
        icon="call-ringing"
        color="success"
        @click="makeCall({user: item})"
      ></wt-rounded-action>
      <img
        class="ws-worksection__item__pic"
        src="../../../../../assets/agent-workspace/default-avatar.svg"
        alt="user photo"
      >
    </div>

    <div class="ws-worksection__item__text">
      <div class="flex-wrap">
        <div class="ws-contact-item__name">{{item.name || item.username}}</div>
        <div class="ws-contact-item__number">{{item.extension}}</div>
      </div>
    </div>
    <div class="ws-worksection__item__status">
      <div
        class="ws-contact-item__status__indicator"
        :class="userStatus"
      ></div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import parseUserStatus
    from '../../../../../store/modules/agent-status/statusUtils/parseUserStatus';
  import UserStatus from '../../../../../store/modules/agent-status/statusUtils/UserStatus';

  export default {
    name: 'workspace-contact',
    props: {
      item: {
        type: Object,
        required: true,
      },

      callable: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      userStatus() {
        const status = parseUserStatus(this.item.presence);
        switch (status) {
          case UserStatus.ACTIVE:
            return 'active';
          case UserStatus.DND:
            return 'dnd';
          case UserStatus.OFFLINE:
            return 'offline';
          case UserStatus.BUSY:
            return 'busy';
          default:
            return '';
        }
      },
    },

    methods: {
      ...mapActions('call', {
        makeCall: 'CALL',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  $offline-color: #808080;

  .flex-wrap {
    height: 100%;
    flex-direction: column;
  }

  .ws-worksection__item__pic-wrap {
    position: relative;

    .ws-contact-item__call-action {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
      pointer-events: none;
    }

    .ws-worksection__item__pic {
      transition: var(--transition);
      cursor: pointer;
    }

    &:hover {
      .ws-contact-item__call-action {
        opacity: 1;
        pointer-events: auto;
      }

      .ws-worksection__item__pic {
        opacity: 0;
        pointer-events: none;
      }
    }
  }

  .ws-contact-item__name {
    @extend .typo-heading-sm;
  }

  .ws-contact-item__number {
    @extend .typo-body-sm;
  }

  .ws-contact-item__status {
    align-self: end;

    &__indicator {
      width: 14px;
      height: 14px;
      border-radius: 50%;

      &.active {
        background: $true-color;
      }

      &.dnd {
        background: $break-color;
      }

      &.offline {
        background: $offline-color;
      }

      &.busy {
        background: $false-color;
      }
    }
  }
</style>
