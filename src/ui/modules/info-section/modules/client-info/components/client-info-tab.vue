<template>
  <section class="client-info">
    <client-info-chips />
    <contact
      v-if="isAllowedContacts"
      :size="props.size"
      :task="props.task"
    />
    <client-info-member
      :collapsed="isAllowedContacts"
      :size="props.size"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ClientInfoMember from './client-info-member/client-info-member.vue';
import ClientInfoChips from './queue-name/client-info-chips.vue';
import Contact from '../modules/contact/components/the-contact.vue';

const props = defineProps({
  task: {
    type: Object,
  },
  size: {
    type: String,
    default: '',
  },
});

const store = useStore();

const isJob = computed(() => store.getters['workspace/IS_JOB_WORKSPACE']);
const isChatClosed = computed(() => store.getters['features/chat/closed/IS_CHAT_ON_WORKSPACE_CLOSED']);
const isCallCenterLicense = computed(() => store.getters[`ui/userinfo/IS_CALL_CENTER_LICENSE`]);
const isCallManagerLicense = computed(() => store.getters['ui/userinfo/IS_CALL_MANAGER_LICENSE']);

const hasLicenses = computed(() => isCallCenterLicense.value || isCallManagerLicense.value);

const isAllowedContacts = computed(() => {
    if (isJob.value) return;
    return hasLicenses.value && !props.task?.hideContact && !isChatClosed.value;
  }
);

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
