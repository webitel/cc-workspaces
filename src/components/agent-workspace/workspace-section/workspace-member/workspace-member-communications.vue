<template>
  <ul class="ws-worksection__list workspace-member-communications__list">
    <li class="workspace-member-communication">
      <div class="workspace-member-communication__type">Mobile</div>
      <div class="workspace-member-communication__destination">+38 (097) 342-22-12</div>
    </li>
    <li class="workspace-member-communication">
      <div class="workspace-member-communication__type">Mobile</div>
      <div class="workspace-member-communication__destination">+38 (097) 342-22-12</div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'workspace-member-communications',
  };
</script>

<style lang="scss" scoped>

  .workspace-member-communication {
    padding: calcVH(10px) calcVH(20px);
    margin-bottom: calcVH(10px);
    border: 1px solid transparent;
    border-radius: $border-radius;
    transition: $transition;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      border-color: $accent-color;
    }

    &__type {
      @extend .typo-heading-sm;
      margin-bottom: calcVH(6px);
    }

    &__destination {
      @extend .typo-body-sm;
    }
  }
</style>
