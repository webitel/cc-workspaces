<template>
  <task-header :size="size">
    <template #before-avatar>
      <slot :name="CallTab.History">
        <wt-rounded-action
          class="call-action"
          :active="isOnHistory"
          :size="size"
          icon="history"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.History)"
        />
      </slot>

      <slot :name="CallTab.Contacts">
        <wt-rounded-action
          class="call-action"
          :active="isOnContacts"
          :size="size"
          icon="contacts"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.Contacts)"
        />
      </slot>
    </template>

    <template #after-avatar>
      <slot :name="CallTab.Bridge">
        <wt-rounded-action
          v-if="isBridge"
          class="call-action"
          :active="isOnBridge"
          :size="size"
          icon="call-add-to"
          color="secondary"
          rounded
          wide
          @click="emit('openTab', CallTab.Bridge)"
        />
      </slot>

      <slot :name="CallTab.Transfer">
        <wt-rounded-action
          v-if="isTransfer"
          class="call-action"
          :size="size"
          icon="call-transfer--filled"
          color="transfer"
          rounded
          wide
          @click="emit('openTab', CallTab.Transfer)"
        />
      </slot>

      <slot name="chat">
        <wt-rounded-action
          class="call-action"
          :active="isOnChat"
          :disabled="!isCallChatExist"
          :size="size"
          icon="chat"
          color="secondary"
          rounded
          wide

          @click="emit('openTab', VideoCallTab.Chat)"
        />
      </slot>

      <slot name="hangup">
        <wt-rounded-action
          v-if="isHangup"
          class="call-action"
          :size="size"
          icon="call-end--filled"
          color="error"
          rounded
          wide
          @click="hangup"
        />
      </slot>

      <slot name="call">
        <wt-rounded-action
          v-if="isDisplayCallButton"
          class="call-action"
          :size="size"
          icon="call-ringing--filled"
          color="success"
          rounded
          wide
          @click="makeCall"
        />
      </slot>
    </template>

    <template #title>
      {{ call?.displayName }}
    </template>

    <template #subtitle>
      {{ call?.displayNumber }}
    </template>
  </task-header>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { CallActions } from 'webitel-sdk';

import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import { CallTab } from '../enums/CallTab.enum';
import { VideoCallTab } from '../module/video-call/enums/VideoCallTab.enum';

interface Props {
  currentTab?: string;
  size?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['openTab']);

const store = useStore();

const callList = computed(() => store.state['features/call']?.callList);
const call = computed(() => store.getters['features/call/CALL_ON_WORKSPACE']);
const isNewCall = computed(() => store.getters['features/call/IS_NEW_CALL']);


const isOnContacts = computed(() => props.currentTab === CallTab.Contacts);
const isOnHistory = computed(() => props.currentTab === CallTab.History);
const isOnBridge = computed(() => props.currentTab === CallTab.Bridge);
const isOnNumpad = computed(() => props.currentTab === CallTab.Numpad);
const isOnChat = computed(() => props.currentTab === VideoCallTab.Chat)
const isBridge = computed(() => {
  const c = call.value;
  return (
    (c.state !== CallActions.Hangup || c.state !== CallActions.Ringing) &&
    callList.value?.filter(
      (c) => c.state !== CallActions.Hangup || c.state !== CallActions.Ringing
    ).length > 1
  );
});
const isTransfer = computed(() => call.value?.allowHangup);
const isHangup = computed(() => call.value?.allowHangup);
const isCall = computed(() => isNewCall.value && call.value?.newNumber);
const isCallChatExist = computed(() =>
  store.getters['features/call/videoCall/chat/IS_VIDEO_CALL_HAVE_CHAT']
);
const isDisplayCallButton = computed(
  () => (isOnNumpad.value || isOnBridge.value) && isCall.value
);


const makeCall = () => store.dispatch('features/call/CALL');
const hangup = () => store.dispatch('features/call/HANGUP');


let hotkeyUnsubscribers: Array<() => void> = [];

const setupHotkeys = () => {
  hotkeyUnsubscribers = useHotkeys([
    {
      event: HotkeyAction.END,
      callback: hangup,
    },
  ]);
};

onMounted(() => setupHotkeys());
onUnmounted(() => hotkeyUnsubscribers.forEach((u) => u()));
</script>

<style lang="scss" scoped>
</style>



<!--<template>-->
<!--  <task-header :size="size">-->
<!--    <template #before-avatar>-->
<!--      <slot name="history">-->
<!--        <wt-rounded-action-->
<!--          class="call-action"-->
<!--          :active="isOnHistory"-->
<!--          :size="size"-->
<!--          icon="history"-->
<!--          color="secondary"-->
<!--          rounded-->
<!--          wide-->
<!--          @click="$emit('openTab', CallTab.History)"-->
<!--        />-->
<!--      </slot>-->

<!--      <slot name="contacts">-->
<!--        <wt-rounded-action-->
<!--          class="call-action"-->
<!--          :active="isOnContacts"-->
<!--          :size="size"-->
<!--          icon="contacts"-->
<!--          color="secondary"-->
<!--          rounded-->
<!--          wide-->
<!--          @click="$emit('openTab', CallTab.Contacts)"-->
<!--        />-->
<!--      </slot>-->
<!--    </template>-->

<!--    <template #after-avatar>-->
<!--      <slot name="bridge">-->
<!--        <wt-rounded-action-->
<!--          v-if="isBridge"-->
<!--          class="call-action"-->
<!--          :active="isOnBridge"-->
<!--          :size="size"-->
<!--          icon="call-add-to"-->
<!--          color="secondary"-->
<!--          rounded-->
<!--          wide-->
<!--          @click="$emit('openTab', CallTab.Bridge)"-->
<!--        />-->
<!--      </slot>-->

<!--      <slot name="transfer">-->
<!--        <wt-rounded-action-->
<!--          v-if="isTransfer"-->
<!--          class="call-action"-->
<!--          :size="size"-->
<!--          icon="call-transfer&#45;&#45;filled"-->
<!--          color="transfer"-->
<!--          rounded-->
<!--          wide-->
<!--          @click="$emit('openTab', CallTab.Transfer)"-->
<!--        />-->
<!--      </slot>-->

<!--      <slot name="hangup">-->
<!--        <wt-rounded-action-->
<!--          v-if="isHangup"-->
<!--          class="call-action"-->
<!--          :size="size"-->
<!--          icon="call-end&#45;&#45;filled"-->
<!--          color="error"-->
<!--          rounded-->
<!--          wide-->
<!--          @click="hangup"-->
<!--        />-->
<!--      </slot>-->
<!--      <slot name="call">-->
<!--        <wt-rounded-action-->
<!--          v-if="isDisplayCallButton"-->
<!--          class="call-action"-->
<!--          :size="size"-->
<!--          icon="call-ringing&#45;&#45;filled"-->
<!--          color="success"-->
<!--          rounded-->
<!--          wide-->
<!--          @click="makeCall"-->
<!--        />-->
<!--      </slot>-->
<!--    </template>-->
<!--    <template #title>-->
<!--      {{ call?.displayName }}-->
<!--    </template>-->
<!--    <template #subtitle>-->
<!--      {{ call?.displayNumber }}-->
<!--    </template>-->
<!--  </task-header>-->
<!--</template>-->

<!--<script>-->
<!--  import { mapActions, mapGetters,mapState } from 'vuex';-->
<!--  import { CallActions } from 'webitel-sdk';-->

<!--  import sizeMixin from '../../../../../../app/mixins/sizeMixin';-->
<!--  import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum';-->
<!--  import { useHotkeys } from '../../../../../hotkeys/useHotkeys';-->
<!--  import displayInfoMixin from '../../../../../mixins/displayInfoMixin';-->
<!--  import TaskHeader from '../../_shared/components/task-header/task-header.vue';-->
<!--  import { CallTab } from '../enums/CallTab.enum';-->

<!--  export default {-->
<!--    name: 'CallHeader',-->
<!--    components: { TaskHeader },-->
<!--    props: {-->
<!--      currentTab: {-->
<!--        type: String,-->
<!--      },-->
<!--      size: {-->
<!--        type: String,-->
<!--        default: 'MD',-->
<!--      },-->
<!--    },-->

<!--    data: () => ({-->
<!--      hotkeyUnsubscribers : [],-->
<!--      // Made CallTab available in template (required for Options API)-->
<!--      CallTab: CallTab,-->
<!--    }),-->

<!--    computed: {-->
<!--      ...mapState('features/call', {-->
<!--        callList: (state) => state.callList,-->
<!--      }),-->
<!--      ...mapGetters('features/call', {-->
<!--        call: 'CALL_ON_WORKSPACE',-->
<!--        isNewCall: 'IS_NEW_CALL',-->
<!--      }),-->

<!--      isOnContacts() {-->
<!--        return this.currentTab === CallTab.Contacts;-->
<!--      },-->

<!--      isOnHistory() {-->
<!--        return this.currentTab === CallTab.History;-->
<!--      },-->

<!--      isOnBridge() {-->
<!--        return this.currentTab === CallTab.Bridge;-->
<!--      },-->

<!--      isOnNumpad() {-->
<!--        return this.currentTab === CallTab.Numpad;-->
<!--      },-->

<!--      isBridge() {-->
<!--        return (this.call.state !== CallActions.Hangup-->
<!--          || this.call.state !== CallActions.Ringing)-->
<!--          && this.callList.filter((call) => (-->
<!--            call.state !== CallActions.Hangup-->
<!--            || call.state !== CallActions.Ringing-->
<!--          )).length > 1;-->
<!--      },-->

<!--      isTransfer() {-->
<!--        return this.call.allowHangup;-->
<!--      },-->

<!--      isHangup() {-->
<!--        return this.call.allowHangup;-->
<!--      },-->

<!--      isCall() {-->
<!--        return this.isNewCall && this.call.newNumber;-->
<!--      },-->

<!--      isDisplayCallButton() {-->
<!--        return (this.isOnNumpad || this.isOnBridge) && this.isCall;-->
<!--      }-->
<!--    },-->

<!--    methods: {-->
<!--      ...mapActions('features/call', {-->
<!--        makeCall: 'CALL',-->
<!--        hangup: 'HANGUP',-->
<!--        setNumber: 'SET_NEW_NUMBER',-->
<!--      }),-->
<!--      setupHotkeys() {-->
<!--        const subscribers = [-->
<!--          {-->
<!--            event: HotkeyAction.END,-->
<!--            callback: this.hangup-->
<!--          }-->
<!--        ];-->
<!--        this.hotkeyUnsubscribers  = useHotkeys(subscribers);-->
<!--      }-->
<!--    },-->

<!--    mounted() {-->
<!--      this.setupHotkeys();-->
<!--    },-->

<!--    unmounted() {-->
<!--      this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());-->
<!--    },-->
<!--  };-->
<!--</script>-->
