<template>
  <section class="client-info">
    <client-info-chips/>
    <contact
      v-if="!hideContact && hasLicenseOnCrm"
      :size="size"
      :task="task"
    />
    <client-info-member/>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import ClientInfoMember from './client-info-member/client-info-member.vue';
import ClientInfoChips from './queue-name/client-info-chips.vue';
import Contact from '../modules/contact/components/the-contact.vue';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'client-info-tab',
  mixins: [sizeMixin],
  components: {
    ClientInfoMember,
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
