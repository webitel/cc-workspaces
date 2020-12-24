<template>
  <article class="processing-communication" :class="{'processing-communication--selected': isSelected}">
    <div class="processing-communication__radio-wrapper">
      <wt-radio
        :selected="isSelected"
        :value="true"
      ></wt-radio>
    </div>
    <div class="processing-communication__info-wrapper">
      <div class="processing-communication__info-destination">{{ communication.destination }}</div>
      <div class="processing-communication__info-type">{{ communication.type.name }}</div>
    </div>
    <div class="processing-communication__priority-wrapper">
      <span class="processing-communication__priority">{{ communication.priority }}</span>
    </div>
    <div class="processing-communication__actions-wrapper">
      <wt-icon-btn
        icon="edit"
        @click.stop="$emit('edit')"
      ></wt-icon-btn>
      <wt-icon-btn
        v-if="deletable"
        icon="bucket"
        @click.stop="$emit('delete')"
      ></wt-icon-btn>
    </div>
  </article>
</template>

<script>
export default {
  name: 'post-processing-communication',
  props: {
    communication: {
      type: Object,
      required: true,
    },

    selected: {
    },

    deletable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isSelected() {
      return this.selected === this.communication;
    },
  },
};
</script>

<style lang="scss" scoped>
.processing-communication {
  --border--hover-color: var(--main-accent-color);
  --bg--active-color: var(--main-option-hover-color);

  display: grid;
  grid-template-columns: 24px 3fr 1fr 58px;
  align-items: center;
  grid-gap: 10px;
  padding: 10px 15px;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  transition: var(--transition);
  cursor: pointer;

  &:hover {
    border-color: var(--border--hover-color);
  }

  &--selected {
    background: var(--bg--active-color);
  }
}

.processing-communication__info-destination {
  @extend %typo-strong-md;
}

.processing-communication__info-type {
  @extend %typo-body-sm;
}

.processing-communication__priority {
  @extend %typo-body-md;
}

.processing-communication__actions-wrapper {
  display: flex;
  justify-content: flex-end;

  .wt-icon-btn:last-child {
    margin-left: 10px;
  }
}
</style>
