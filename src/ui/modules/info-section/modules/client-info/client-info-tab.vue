<template>
  <section class="client-info">
    <client-info-chips />
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
import { mapGetters, mapState } from 'vuex';
import ClientInfoMember from './components/client-info-member/client-info-member.vue';
import ClientInfoChips from './components/client-info-chips/client-info-chips.vue';
import Contact from './modules/contact/components/the-contact.vue';
import sizeMixin from '../../../../../app/mixins/sizeMixin.js';

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
    ...mapGetters('workspace', {
      isJob: 'IS_JOB_WORKSPACE',
    }),
    ...mapGetters('features/chat/closed', {
      isChatClosed: 'IS_CHAT_ON_WORKSPACE_CLOSED',
    }),
    hasLicenseOnCrm() {
      return this.scope?.some((item) => item.class === 'contacts');
    },
    isAllowedContacts() {
      if (this.isJob) return;
      return this.hasLicenseOnCrm && !this.task?.hideContact && !this.isChatClosed;
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
