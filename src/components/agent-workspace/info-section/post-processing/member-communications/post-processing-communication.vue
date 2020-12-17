<template>
  <article class="processing-communication" :class="{'processing-communication--selected': selected}">
    <div class="processing-communication__radio-wrapper">
      <wt-radio :selected="selected" :value="selected"></wt-radio>
    </div>
    <div class="processing-communication__info-wrapper">
      <div class="processing-communication__info-phone">{{ communication.number }}</div>
      <div class="processing-communication__info-name">{{ communication.type.name }}</div>
    </div>
    <div class="processing-communication__priority-wrapper">
      <span class="processing-communication__priority">{{ communication.priority }}</span>
    </div>
    <div class="processing-communication__actions-wrapper">
      <wt-icon-btn
        icon="edit"
        @click="$emit('edit')"
      ></wt-icon-btn>
      <wt-icon-btn
        v-if="deletable"
        icon="bucket"
        @click="$emit('delete')"
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
      // required: true,
      default: () => ({
        number: '8 800 555 3535',
        type: { name: 'mobile' },
        priority: 22,
      }),
    },

    selected: {
      type: String,
      required: true,
    },

    deletable: {
      type: Boolean,
      default: true,
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

.processing-communication__info-phone {
  @extend %typo-strong-md;
}

.processing-communication__info-name {
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
