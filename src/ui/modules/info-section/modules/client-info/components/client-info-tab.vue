<template>
  <section class="client-info">
    <client-info-chips/>
    <contact
      v-if="isAllowedContacts"
      :size="size"
      :task="task"
    />
    <client-info-member
      :collapsed="isAllowedContacts"
      :size="size"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';
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
      return this.scope?.some((item) => item.class === 'contacts');
    },
    isAllowedContacts() {
      return this.hasLicenseOnCrm && !this.task?.hideContact;
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
  word-break: break-all;
}
</style>
