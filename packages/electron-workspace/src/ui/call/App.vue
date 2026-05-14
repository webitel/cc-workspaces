<template>
  <main class="container">
    <h1>{{ $t("title") }}</h1>
    <section v-if="currentCall" class="card">
      <p><strong>ID:</strong> {{ currentCall.id }}</p>
      <p><strong>Name:</strong> {{ currentCall.displayName || "-" }}</p>
      <p><strong>Number:</strong> {{ currentCall.displayNumber || "-" }}</p>
    </section>
    <p v-else>{{ $t("noCall") }}</p>
    <div class="actions">
      <button type="button" @click="sendAction('answer')">{{ $t("answer") }}</button>
      <button type="button" @click="sendAction('reject')">{{ $t("reject") }}</button>
      <button type="button" @click="sendAction('hold')">{{ $t("hold") }}</button>
      <button type="button" @click="sendAction('mute')">{{ $t("mute") }}</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

type CallPayload = {
	id: string | number;
	displayName?: string;
	displayNumber?: string;
};

const currentCall = ref<CallPayload | null>(null);
const ipcRenderer =
	typeof require === 'function' ? require('electron').ipcRenderer : null;

function sendAction(action: 'answer' | 'reject' | 'hold' | 'mute') {
	ipcRenderer?.send('call-action', action);
}

function onShowCall(_event: unknown, payload: CallPayload) {
	currentCall.value = payload;
}

function onDestroyCall() {
	currentCall.value = null;
}

onMounted(() => {
	ipcRenderer?.on('show-call', onShowCall);
	ipcRenderer?.on('destroy-notification', onDestroyCall);
});

onUnmounted(() => {
	ipcRenderer?.removeListener('show-call', onShowCall);
	ipcRenderer?.removeListener('destroy-notification', onDestroyCall);
});
</script>
