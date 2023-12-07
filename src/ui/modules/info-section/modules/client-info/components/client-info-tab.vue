<template>
  <section class="client-info">
    <client-info-chips/>
    <client-info-markdown/>
    <contact
      v-if="!hideContact && hasLicenseOnCrm"
      :size="size"
      :task="task"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ClientInfoMarkdown from './client-info-markdown/client-info-markdown.vue';
import ClientInfoChips from './queue-name/client-info-chips.vue';
import Contact from '../modules/contact/components/the-contact.vue';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';

export default {
  name: 'client-info-tab',
  mixins: [sizeMixin],
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
    ...mapState('ui/userinfo', {
      scope: (state) => state.scope,
    }),
    hasLicenseOnCrm() {
      return this.scope.some((item) => item.class === 'contacts');
    },
    hideContact() {
      return !isEmpty(this.task) ? this.task.contact.hide : true;
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
