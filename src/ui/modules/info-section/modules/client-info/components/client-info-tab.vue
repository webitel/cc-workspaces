<template>
  <section class="client-info">
    <client-info-chips />
    <contact
      v-if="isAllowedContacts"
      :size="props.size"
      :task="props.task"
    />
    <client-info-member
      :size="props.size"
      :collapsed="false"
    />
  </section>
</template>

<script setup>
import ConfigurationAPI from '@webitel/ui-sdk/src/api/clients/configurations/configurations';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { EngineSystemSettingName } from 'webitel-sdk';

import Contact from '../modules/contact/components/the-contact.vue';
import ClientInfoMember from './client-info-member/client-info-member.vue';
import ClientInfoChips from './queue-name/client-info-chips.vue';

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

const isHideContact = ref(false);

const isJob = computed(() => store.getters['workspace/IS_JOB_WORKSPACE']);
const isChatClosed = computed(() => store.getters['features/chat/closed/IS_CHAT_ON_WORKSPACE_CLOSED']);
const hasCallCenterLicense = computed(() => store.getters['ui/userinfo/IS_CALL_CENTER_LICENSE']);

const getValueWbtHideContactVariable = async () => {
  const { items } = await ConfigurationAPI.getList({
    name: [EngineSystemSettingName.WbtHideContact],
  });
  return items?.[0]?.value;
};

const isAllowedContacts = computed(() => {
    if (isJob.value) return;
    return !isHideContact.value && !props.task?.hideContact && !isChatClosed.value && hasCallCenterLicense.value;
  }
);

onMounted(async () => {
  isHideContact.value = await getValueWbtHideContactVariable();
})
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.client-info {
  @extend %wt-scrollbar;
  max-height: 100%;
  min-height: 0;
  overflow: auto;
  word-break: break-all;
}
</style>
