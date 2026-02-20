<template>
  <div class="call-contacts-container">
    <wt-tabs
      v-if="tabs.length > 1"
      :current="currentTab"
      :tabs="tabs"
      wide
      @change="changeTab"
    />
    <component
      :is="currentTab.component"
      class="call-contacts-container-content"
      :size="size"
    />
  </div>
</template>

<script setup>
import { EngineSystemSettingName } from '@webitel/api-services/gen';
import { configurations } from '@webitel/ui-sdk/api/clients';
import { WtObject } from '@webitel/ui-sdk/enums';
import {
	SpecialGlobalAction,
	WebitelLicense,
} from '@webitel/ui-sdk/modules/Userinfo';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useUserinfoStore } from '../../../../../../modules/userinfo/userinfoStore';
import ContactsContainer from './contacts/contacts-container.vue';
import UsersContainer from './users/users-container.vue';

const { t } = useI18n();
const store = useStore();

const props = defineProps({
	size: {
		type: String,
		default: 'md',
		options: [
			'sm',
			'md',
		],
	},
});

const { hasSpecialGlobalActionAccess, hasLicense } = useUserinfoStore();
const isLimitContactsGranted = hasSpecialGlobalActionAccess(
	SpecialGlobalAction.LimitWorkspaceContacts,
);

const isLabelToLimitContactsGranted = ref(false);

async function checkLabelToLimitContacts() {
	const { items } = await configurations.getList({
		name: EngineSystemSettingName.LabelsToLimitContacts,
	});

	isLabelToLimitContactsGranted.value = !!items.length;
}

onMounted(() => {
	checkLabelToLimitContacts();
});

const currentTab = ref({});

const tabsObject = computed(() => ({
	CallContactsTab: {
		text: t('WtApplication.crm.sections.contacts', 2),
		value: 'contacts', // tracked by wt-tabs
		component: ContactsContainer,
	},
	CallUsersTab: {
		text: t('WtApplication.admin.sections.users', 2),
		value: 'users', // tracked by wt-tabs
		component: UsersContainer,
	},
}));

const { hasReadAccess: hasContactsReadAccess } = useUserAccessControl(
	WtObject.Contact,
);
const hasCallCenterLicense = computed(() =>
	hasLicense(WebitelLicense.CallCenter),
);

const tabs = computed(() => {
	const tabs = [
		tabsObject.value.CallUsersTab,
	];

	if (
		hasContactsReadAccess.value &&
		hasCallCenterLicense.value &&
		(!isLimitContactsGranted || isLabelToLimitContactsGranted.value)
	) {
		tabs.unshift(tabsObject.value.CallContactsTab);
	}

	return tabs;
});

function changeTab(tab) {
	currentTab.value = tab;
}

changeTab(tabs.value[0]);
</script>

<style lang="scss" scoped>
.call-contacts-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-xs);

  .call-contacts-container-content {
    flex: 1;
  }
}

</style>
