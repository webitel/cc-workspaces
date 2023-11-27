<template>
  <section class="client-info">
    <client-info-chips/>
    <client-info-markdown/>
    <contact
      v-if="!isHideContact"
      :size="size"/>
  </section>
</template>

<script>
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { mapGetters } from 'vuex';
import ClientInfoMarkdown from './client-info-markdown/client-info-markdown.vue';
import ClientInfoChips from './queue-name/client-info-chips.vue';
import Contact from '../modules/contact/components/the-contact.vue';
import SizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'client-info-tab',
  mixins: [SizeMixin],
  components: {
    ClientInfoMarkdown,
    ClientInfoChips,
    Contact,
  },
  props: {
    task: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters('features/call', {
      call: 'CALL_ON_WORKSPACE',
    }),
    isHideContact() {
      return !isEmpty(this.call) ? this.call.hideContact : true;
    },
  },
};
</script>

<style lang="scss" scoped>
.client-info {
  @extend %wt-scrollbar;
  max-height: 100%;
  min-height: 0;
  overflow: auto;
}
</style>
