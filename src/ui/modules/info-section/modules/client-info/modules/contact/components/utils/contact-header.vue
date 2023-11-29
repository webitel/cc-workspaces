<template>
  <header
    class="contact-header" >
    <div>
      <wt-icon-btn
        v-if="props.isPrev"
        icon="arrow-left"
        @click="emit('prev')"
      ></wt-icon-btn>
    </div>
    <div>{{title}}</div>
    <div>
      <wt-icon-btn
        v-if="props.isNext"
        icon="arrow-right"
        @click="emit('next')"
      ></wt-icon-btn>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const props = defineProps({
  isNext: {
    type: Boolean,
    default: false,
  },
  isPrev: {
    type: Boolean,
    default: false,
  },
  lenght: {
    type: Number,
    default: 0,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['next', 'prev']);
const { t } = useI18n();

const current = computed(() => props.index + 1);

const title = computed(() => {
  console.log(props.lenght)
  if (props.lenght === 1) {

    return t(
      'infoSec.contacts.foundOneContact',
      { count: props.lenght },
    );
  } else {
    return t(
      'infoSec.contacts.foundSomeContact',
      { current: current.value, count: props.lenght },
    );
  }
});
</script>
<style lang="scss" scoped>
//.header {
//  display: grid;
//  grid-template-columns: 24px 1fr 24px;
//}

.contact-header {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs);
  border: var(--input-border);
  border-color: var(--form-border-color);
  border-radius: 4px;
  border: 1px solid var(--wt-table-header-border-color, #737EA1); ////перепитати Женю
}
</style>
